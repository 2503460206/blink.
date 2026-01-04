// 移动端菜单切换
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 关闭移动端菜单
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// 照片墙筛选功能
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // 移除所有按钮的active类
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 为当前点击的按钮添加active类
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// 音乐作品显示/隐藏功能
const showAllBtn = document.getElementById('showAllBtn');
const albumsContainer = document.getElementById('albumsContainer');
const albums = document.querySelectorAll('.album');

// 默认只显示前4张专辑
let showAll = false;

// 按钮点击事件
showAllBtn.addEventListener('click', function() {
    if (!showAll) {
        // 显示所有专辑
        albums.forEach(album => {
            album.classList.remove('hidden');
        });
        albumsContainer.classList.remove('hidden');
        showAllBtn.textContent = '收起作品';
        showAll = true;
    } else {
        // 只显示前4张专辑
        for (let i = 0; i < albums.length; i++) {
            if (i >= 4) {
                albums[i].classList.add('hidden');
            }
        }
        albumsContainer.classList.add('hidden');
        showAllBtn.textContent = '查看全部作品';
        showAll = false;
    }
});

// ============================ 游戏逻辑 ============================
// 游戏数据 - BLACKPINK相关题目
const gameQuestions = [
    {
        question: "BLACKPINK于哪一年正式出道？",
        options: ["2014年", "2016年", "2018年", "2020年"],
        correctAnswer: 1, // 2016年
        explanation: "BLACKPINK于2016年8月8日正式出道，发行首张单曲专辑《SQUARE ONE》。"
    },
    {
        question: "以下哪位成员不是韩国籍？",
        options: ["JISOO", "JENNIE", "ROSÉ", "LISA"],
        correctAnswer: 3, // LISA
        explanation: "LISA是泰国籍，其他三位成员都是韩国籍。"
    },
    {
        question: "BLACKPINK的官方粉丝名是什么？",
        options: ["BLINK", "ONCE", "ARMY", "STAY"],
        correctAnswer: 0, // BLINK
        explanation: "BLACKPINK的官方粉丝名是BLINK，由BLACK和PINK组合而成。"
    },
    {
        question: "以下哪首歌不是BLACKPINK的主打曲？",
        options: ["DDU-DU DDU-DU", "Kill This Love", "SOLO", "How You Like That"],
        correctAnswer: 2, // SOLO
        explanation: "《SOLO》是JENNIE的个人单曲，不是BLACKPINK的团体歌曲。"
    },
    {
        question: "哪位成员曾担任《人气歌谣》的MC？",
        options: ["JISOO", "JENNIE", "ROSÉ", "LISA"],
        correctAnswer: 0, // JISOO
        explanation: "JISOO曾与金珉奎共同担任《人气歌谣》的MC。"
    },
    {
        question: "BLACKPINK在科切拉音乐节表演是在哪一年？",
        options: ["2018年", "2019年", "2020年", "2022年"],
        correctAnswer: 1, // 2019年
        explanation: "BLACKPINK于2019年4月登上科切拉音乐节，成为首个在该音乐节主舞台表演的韩国女团。"
    },
    {
        question: "哪位成员有'人间香奈儿'的称号？",
        options: ["JISOO", "JENNIE", "ROSÉ", "LISA"],
        correctAnswer: 1, // JENNIE
        explanation: "JENNIE因多次身着香奈儿服装并担任品牌大使，被粉丝称为'人间香奈儿'。"
    },
    {
        question: "BLACKPINK的官方应援色是什么？",
        options: ["粉红色", "黑色", "粉黑色", "玫瑰金"],
        correctAnswer: 2, // 粉黑色
        explanation: "BLACKPINK的官方应援色是粉黑色，代表组合名称BLACK和PINK的结合。"
    },
    {
        question: "哪位成员是YG娱乐成立以来首位出道的外国艺人？",
        options: ["JISOO", "JENNIE", "ROSÉ", "LISA"],
        correctAnswer: 3, // LISA
        explanation: "LISA是YG娱乐成立以来首位出道的外国艺人，来自泰国。"
    },
    {
        question: "BLACKPINK的首张正规专辑名称是什么？",
        options: ["THE ALBUM", "BORN PINK", "SQUARE UP", "KILL THIS LOVE"],
        correctAnswer: 0, // THE ALBUM
        explanation: "BLACKPINK的首张正规专辑《THE ALBUM》于2020年10月2日发行。"
    }
];

// 游戏状态
let gameState = {
    currentQuestionIndex: 0,
    score: 0,
    timer: 20,
    timerInterval: null,
    gameStarted: false
};

// 游戏界面元素
const gameStartElement = document.getElementById('gameStart');
const gamePlayElement = document.getElementById('gamePlay');
const gameEndElement = document.getElementById('gameEnd');
const startGameBtn = document.getElementById('startGameBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const shareGameBtn = document.getElementById('shareGameBtn');

// 游戏统计元素
const currentQuestionElement = document.getElementById('currentQuestion');
const currentScoreElement = document.getElementById('currentScore');
const timeLeftElement = document.getElementById('timeLeft');
const progressBarElement = document.getElementById('progressBar');

// 游戏内容元素
const questionTextElement = document.getElementById('questionText');
const gameOptionsElement = document.getElementById('gameOptions');
const gameFeedbackElement = document.getElementById('gameFeedback');
const feedbackTitleElement = document.getElementById('feedbackTitle');
const feedbackTextElement = document.getElementById('feedbackText');

// 游戏结果元素
const finalScoreElement = document.getElementById('finalScore');
const resultTitleElement = document.getElementById('resultTitle');
const resultMessageElement = document.getElementById('resultMessage');

// 游戏开始
startGameBtn.addEventListener('click', startGame);

// 下一题
nextQuestionBtn.addEventListener('click', nextQuestion);

// 重新开始游戏
restartGameBtn.addEventListener('click', restartGame);

// 分享结果
shareGameBtn.addEventListener('click', shareResult);

// 开始游戏函数
function startGame() {
    // 重置游戏状态
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.gameStarted = true;
    
    // 切换界面
    gameStartElement.style.display = 'none';
    gamePlayElement.style.display = 'block';
    gameEndElement.style.display = 'none';
    
    // 加载第一题
    loadQuestion();
    
    // 更新统计信息
    updateStats();
    
    // 开始计时器
    startTimer();
}

// 加载题目
function loadQuestion() {
    const currentQuestion = gameQuestions[gameState.currentQuestionIndex];
    
    // 更新问题文本
    questionTextElement.textContent = currentQuestion.question;
    
    // 更新问题编号
    currentQuestionElement.textContent = `${gameState.currentQuestionIndex + 1}/10`;
    
    // 清空选项
    gameOptionsElement.innerHTML = '';
    
    // 创建选项按钮
    const optionLetters = ['A', 'B', 'C', 'D'];
    
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-btn';
        optionButton.dataset.index = index;
        
        optionButton.innerHTML = `
            <span class="option-letter">${optionLetters[index]}</span>
            <span class="option-text">${option}</span>
        `;
        
        optionButton.addEventListener('click', () => selectOption(index));
        gameOptionsElement.appendChild(optionButton);
    });
    
    // 隐藏反馈区域
    gameFeedbackElement.style.display = 'none';
    
    // 重置计时器
    resetTimer();
}

// 选择选项
function selectOption(selectedIndex) {
    // 停止计时器
    clearInterval(gameState.timerInterval);
    
    const currentQuestion = gameQuestions[gameState.currentQuestionIndex];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // 禁用所有选项按钮
    optionButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });
    
    // 标记正确答案和错误答案
    optionButtons.forEach((btn, index) => {
        if (index === currentQuestion.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== currentQuestion.correctAnswer) {
            btn.classList.add('wrong');
        }
    });
    
    // 检查答案是否正确
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    
    // 更新分数
    if (isCorrect) {
        gameState.score += 10;
        feedbackTitleElement.textContent = '回答正确！';
        feedbackTitleElement.style.color = '#28a745';
    } else {
        feedbackTitleElement.textContent = '回答错误！';
        feedbackTitleElement.style.color = '#dc3545';
    }
    
    // 显示反馈
    feedbackTextElement.textContent = currentQuestion.explanation;
    gameFeedbackElement.style.display = 'block';
    
    // 更新统计信息
    updateStats();
}

// 下一题
function nextQuestion() {
    // 移动到下一题
    gameState.currentQuestionIndex++;
    
    // 检查游戏是否结束
    if (gameState.currentQuestionIndex >= gameQuestions.length) {
        endGame();
    } else {
        // 加载下一题
        loadQuestion();
        
        // 开始新的计时器
        startTimer();
    }
}

// 结束游戏
function endGame() {
    // 切换界面
    gamePlayElement.style.display = 'none';
    gameEndElement.style.display = 'block';
    
    // 显示最终得分
    finalScoreElement.textContent = gameState.score;
    
    // 根据得分确定称号和评价
    let title = '';
    let message = '';
    
    if (gameState.score >= 90) {
        title = 'BLACKPINK专家';
        message = '太厉害了！你绝对是BLACKPINK的忠实粉丝，对她们的了解非常深入！继续支持BLACKPINK吧！';
    } else if (gameState.score >= 70) {
        title = '资深BLINK';
        message = '做得不错！你对BLACKPINK有很好的了解，是一个合格的BLINK！';
    } else if (gameState.score >= 50) {
        title = '普通粉丝';
        message = '还不错！你对BLACKPINK有一定了解，但还可以了解更多哦！';
    } else {
        title = '新粉入门';
        message = '没关系，每个人都是从新粉开始的！多听听BLACKPINK的音乐，你会越来越了解她们的！';
    }
    
    // 更新结果界面
    resultTitleElement.textContent = title;
    resultMessageElement.textContent = message;
}

// 重新开始游戏
function restartGame() {
    // 重置游戏状态
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    
    // 切换到开始界面
    gameStartElement.style.display = 'block';
    gamePlayElement.style.display = 'none';
    gameEndElement.style.display = 'none';
}

// 分享结果
function shareResult() {
    const shareText = `我在BLACKPINK粉丝知识问答中获得了${gameState.score}分，成为了${resultTitleElement.textContent}！你也来挑战吧！`;
    
    // 检查是否支持Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'BLACKPINK粉丝知识问答结果',
            text: shareText,
            url: window.location.href
        });
    } else {
        // 如果不支持Web Share API，则复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            alert('结果已复制到剪贴板！你可以粘贴到社交媒体分享。');
        });
    }
}

// 更新统计信息
function updateStats() {
    currentScoreElement.textContent = gameState.score;
    
    // 更新进度条
    const progressPercentage = (gameState.currentQuestionIndex / gameQuestions.length) * 100;
    progressBarElement.style.width = `${progressPercentage}%`;
}

// 开始计时器
function startTimer() {
    // 重置时间
    gameState.timer = 20;
    timeLeftElement.textContent = gameState.timer;
    
    // 清除之前的计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // 开始新的计时器
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        timeLeftElement.textContent = gameState.timer;
        
        // 时间到
        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            
            // 自动选择错误答案（因为没有选择）
            const optionButtons = document.querySelectorAll('.option-btn');
            if (optionButtons.length > 0) {
                // 标记第一个选项为错误（因为没有选择）
                optionButtons[0].classList.add('wrong');
                
                // 标记正确答案
                const currentQuestion = gameQuestions[gameState.currentQuestionIndex];
                optionButtons[currentQuestion.correctAnswer].classList.add('correct');
                
                // 禁用所有选项
                optionButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.cursor = 'not-allowed';
                });
                
                // 显示反馈
                feedbackTitleElement.textContent = '时间到！';
                feedbackTitleElement.style.color = '#dc3545';
                feedbackTextElement.textContent = currentQuestion.explanation;
                gameFeedbackElement.style.display = 'block';
            }
        }
    }, 1000);
}

// 重置计时器
function resetTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    gameState.timer = 20;
    timeLeftElement.textContent = gameState.timer;
}