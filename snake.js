class Snake{
    constructor(){
        this.initialize();
        this.network = new Network();
    }
    initialize(){
        this.segments = [];
        this.segments.push({x:50,y:50});
        this.head = {x:50,y:50};
        this.placeFood();
        this.score = 0;
        this.timeToLive = 600;
        this.grow = 5;
        this.alive = true;
    }
    placeFood(){
        this.food = {x:this.randInt(0,99),y:this.randInt(0,99)};
    }
    /* Compute inputs of the NN and use it to compute the outputs of the NN
       then, compute the best move. */
    think(){
        // Angle between head and food, normalized to the range [-1, 1]
        let angleToFood = Math.atan2(this.food.y-this.head.y,this.food.x-this.head.x) / Math.PI;
        // Max Distance on an Axis between food and head
        let dist = Math.max(Math.abs(this.food.y-this.head.y), Math.abs(this.food.x-this.head.x)) / 100.0;
        // 1 = neighbouring cell occupied, 0 = neighbouring cell empty/is food
        let up=0,down=0,left=0,right=0;
        for(let seg of this.segments){
            if(seg.x==this.head.x && seg.y == this.head.y-1){
                up = 1;
            }
            if(seg.x==this.head.x && seg.y == this.head.y+1){
                down = 1;
            }
            if(seg.x==this.head.x-1 && seg.y == this.head.y){
                left = 1;
            }
            if(seg.x==this.head.x+1 && seg.y == this.head.y){
                right = 1;
            }
        }
        if(this.head.y-1 < 0){
            up = 1;
        }
        if(this.head.y+1 < 0){
            down = 1;
        }
        if(this.head.x-1 < 0){
            left = 1;
        }
        if(this.head.x+1 < 0){
            right = 1;
        }
        let outputs = this.network.forwardPass([[angleToFood],[dist],[up],[down],[left],[right],[1]]);
        let biggest = outputs[0];
        let bestMove = 0;
        for(let i = 0;i<outputs.length;i++){
            if(outputs[i] > biggest){
                biggest = outputs[i];
                bestMove = i;
            }
        }
        return bestMove;
    }
    /* Moves snake by adding a segment to the head, and removing the tail segment. */
    move(dir){
        switch(dir){
            case 0:// up
                this.head.y-=1;
                break;
            case 1:// down
                this.head.y+=1;
                break;
            case 2:// left
                this.head.x-=1;
                break;
            case 3:// right
                this.head.x+=1;
                break;
        }
        // If the snake ain't growing, remove the tail segment
        if(this.grow <= 0){
            this.segments.shift();
        }else{
            this.grow-= 1;
        }
        
        if(this.detectCollisions()){
            this.alive = false;
        }
        
        if(this.head.x == this.food.x && this.head.y == this.food.y){
            this.score += 1000;
            this.timeToLive = 600;
            this.placeFood();
            this.grow = 10;
        }
        if(this.alive){
            this.score += 1;
        }
        if(this.timeToLive > 0){
            this.timeToLive -= 1;
        }else{
            this.alive = false;
        }
        this.segments.push({x:this.head.x, y:this.head.y});
        
    }
    // Check for Collisions
    detectCollisions(){
        // Check for wall collisions
        if(this.head.x<0 || this.head.x >= 100 || this.head.y<0 || this.head.y >= 100){
            return true;
        }
        // Check for snake collisions
        for(let seg of this.segments){
            if(seg.x == this.head.x && seg.y == this.head.y){
                return true;
            }
        }
        
        return false;
    }
    // Performs Uniform crossover and random mutations
    crossoverAndMutate(A, B, mutationProb){
        for(let i = 0;i<this.network.weightMatrices.length;i++){
            for(let j = 0;j<this.network.weightMatrices[i].length;j++){
                for(let k = 0;k<this.network.weightMatrices[i][j].length;k++){
                    if(Math.random() < 0.5){
                        this.network.weightMatrices[i][j][k] = A.network.weightMatrices[i][j][k];
                    }else{
                        this.network.weightMatrices[i][j][k] = B.network.weightMatrices[i][j][k];
                    }
                    if(Math.random() < mutationProb){
                        this.network.weightMatrices[i][j][k] = this.network.generateRandomWeight();
                    }   
                }          
            }           
        }
    }
    
    
    randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}