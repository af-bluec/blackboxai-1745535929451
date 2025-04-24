class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Game objects
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 10,
            dx: 5,
            dy: 5,
            speed: 5
        };
        
        this.paddleHeight = 80;
        this.paddleWidth = 10;
        this.playerPaddle = {
            x: 50,
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            dy: 0,
            speed: 8
        };
        
        this.computerPaddle = {
            x: this.canvas.width - 50 - this.paddleWidth,
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            dy: 0,
            speed: 6
        };
        
        // Score
        this.playerScore = 0;
        this.computerScore = 0;
        
        // Game state
        this.isRunning = false;
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        
        // UI elements
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.playerScoreElement = document.getElementById('playerScore');
        this.computerScoreElement = document.getElementById('computerScore');
        
        // Button event listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
    }
    
    startGame() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startButton.classList.add('hidden');
            this.restartButton.classList.remove('hidden');
            this.animate();
        }
    }
    
    restartGame() {
        // Reset ball position
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = 5;
        this.ball.dy = 5;
        
        // Reset paddles
        this.playerPaddle.y = this.canvas.height / 2 - this.paddleHeight / 2;
        this.computerPaddle.y = this.canvas.height / 2 - this.paddleHeight / 2;
        
        // Reset scores
        this.playerScore = 0;
        this.computerScore = 0;
        this.updateScore();
        
        // Start game if not running
        if (!this.isRunning) {
            this.startGame();
        }
    }
    
    handleKeyDown(e) {
        if (e.key === 'w' || e.key === 'W') {
            this.playerPaddle.dy = -this.playerPaddle.speed;
        }
        if (e.key === 's' || e.key === 'S') {
            this.playerPaddle.dy = this.playerPaddle.speed;
        }
    }
    
    handleKeyUp(e) {
        if ((e.key === 'w' || e.key === 'W') && this.playerPaddle.dy < 0) {
            this.playerPaddle.dy = 0;
        }
        if ((e.key === 's' || e.key === 'S') && this.playerPaddle.dy > 0) {
            this.playerPaddle.dy = 0;
        }
    }
    
    updateScore() {
        this.playerScoreElement.textContent = this.playerScore;
        this.computerScoreElement.textContent = this.computerScore;
    }
    
    movePaddles() {
        // Player paddle movement
        this.playerPaddle.y += this.playerPaddle.dy;
        this.playerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.playerPaddle.y));
        
        // Computer AI
        const paddleCenter = this.computerPaddle.y + this.paddleHeight / 2;
        const ballCenter = this.ball.y;
        
        if (paddleCenter < ballCenter - 10) {
            this.computerPaddle.y += this.computerPaddle.speed;
        } else if (paddleCenter > ballCenter + 10) {
            this.computerPaddle.y -= this.computerPaddle.speed;
        }
        
        this.computerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.computerPaddle.y));
    }
    
    moveBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Top and bottom collisions
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy *= -1;
        }
        
        // Paddle collisions
        if (this.checkPaddleCollision(this.playerPaddle) || 
            this.checkPaddleCollision(this.computerPaddle)) {
            this.ball.dx *= -1.1; // Increase speed slightly
            this.ball.dy = (Math.random() - 0.5) * this.ball.speed * 2; // Add some randomness
        }
        
        // Scoring
        if (this.ball.x <= 0) {
            this.computerScore++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.x >= this.canvas.width) {
            this.playerScore++;
            this.updateScore();
            this.resetBall();
        }
    }
    
    checkPaddleCollision(paddle) {
        return this.ball.x >= paddle.x && 
               this.ball.x <= paddle.x + this.paddleWidth &&
               this.ball.y >= paddle.y && 
               this.ball.y <= paddle.y + this.paddleHeight;
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx *= -1;
        this.ball.dy = (Math.random() - 0.5) * this.ball.speed * 2;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#111827';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw ball
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw paddles
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.computerPaddle.x, this.computerPaddle.y, this.paddleWidth, this.paddleHeight);
    }
    
    animate() {
        if (this.isRunning) {
            this.movePaddles();
            this.moveBall();
            this.draw();
            requestAnimationFrame(this.animate);
        }
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new PongGame();
});
