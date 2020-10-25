document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    
    let doodlerleftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0
    

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerleftSpace = platforms[0].left
        doodler.style.left = doodlerleftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
            
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function cratePlatforms() {
        for(let i=0; i<platformCount; i++){
            let platformGap = 600/platformCount
            let newPlatBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }
    
    function movePlatforms(){
        if (doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
           
                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
           
            })
        }
    }

    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        }, 30)
    }
    
    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) && 
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerleftSpace + 60) >= platform.left) &&
                    (doodlerleftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30)
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true
        while(grid.firstElementChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        if(e.key === "ArrowLeft") {
            moveleft()
        } else if(e.key === "ArrowRight") {
            moveRight()
        } else if(e.key === "AroowUp") {
            moveStraight()
        }
    }

    function moveleft() {
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function() {
            if(doodlerleftSpace >= 0) {
                doodlerleftSpace -= 5
                doodler.style.left = doodlerleftSpace + 'px'
            } else moveRight()
            
        }, 20)
    }

    function moveRight() {
        if(isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isgoingRight = true
        rightTimerid = setInterval(function() {
            if(doodlerleftSpace <= 340){
                doodlerleftSpace += 5
                doodler.style.left = doodlerleftSpace + 'px'
            } else moveleft()
        }, 20)

    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false 
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }


    function start(){
        if(!isGameOver) {
            cratePlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        } 
    }
    //TODO:attach to button
    start()
})