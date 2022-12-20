
class Render{
    
    constructor(){
        this.setupGraph();
        this.setupButtons();
        this.networkRenderer = new RenderNN();
        this.g = document.getElementById("canvas").getContext("2d");
        this.snakes = [];
        for(let i=0;i<500;i++){
            this.snakes.push(new Snake());
        }
        this.networkRenderer.drawNetwork(this.snakes[0].network);
        this.numAliveSnakes = this.snakes.length;
        this.colors = ["#0000FF", "#00FF00", "#FF0000", "#00FFFF", "#FF00FF", "#FFFF00"];
        this.targetIterCount = 1;
        this.mutationProb = 0.01; // 1%
        this.renderDeadSnakes = true;
    }
    
    async start(){
        this.generation = 0;
        for(let frame=0;;frame++){
            let startTime = new Date().getTime();
            let iterCount = 0;
            while(new Date().getTime() - startTime <= 16 && iterCount < this.targetIterCount){
                iterCount += 1;
                this.numAliveSnakes = this.evalSnakes();
                
                if(this.numAliveSnakes === 0){
                    this.prepareNextGeneration();
                    this.numAliveSnakes = this.snakes.length;
                    break;
                }
            }
            
            
            this.drawBackground();
            
            this.drawSnakes();
                  
            this.drawGrid();
            document.getElementById("aliveSnakeCount").innerHTML = this.numAliveSnakes;
            await delay(16);
        }
    }
    prepareNextGeneration(){
        // Sort snakes based on score in descending order.
        this.snakes.sort(function(x,y) {return y.score - x.score});
        
        // Update score graph.
        this.updateGraph(this.generation, [this.snakes[0].score, this.snakes[9].score, this.snakes[49].score]);
        this.generation += 1;
        
        // Update Network Render
        this.networkRenderer.drawNetwork(this.snakes[0].network);
        
        // Perform Crossover and replace 98% of the population.
        let numSnakesToKeep = 10
        for(let i=numSnakesToKeep;i<500;i++){
            this.snakes[i].crossoverAndMutate(this.snakes[this.randInt(0, numSnakesToKeep-1)], this.snakes[this.randInt(0, numSnakesToKeep-1)], this.mutationProb);
        }
        // reset snakes
        for(let snake of this.snakes){
            snake.initialize();
        }
        
    }
   
    /* Evaluate the performance of every snake.
       Also retuns the number of snakes currently alive. */
    evalSnakes(){
        let aliveCount = 0;
        for(let snake of this.snakes){
            if(snake.alive){
                aliveCount+=1;
                let direction = snake.think();
                snake.move(direction);
            }
        }
        return aliveCount;
    }
    
    drawSnakes(){
        let i = 0;
        let colorIndex=0;
        for(let snake of this.snakes){
            this.g.fillStyle = this.colors[colorIndex%this.colors.length];
            colorIndex++;
            if(!snake.alive && !this.renderDeadSnakes){
                continue;
            }
            i++;
            if(i>16){
                break;
            }
            
            for(let seg of snake.segments){              
                this.g.fillRect(seg.x*5, seg.y*5, 5, 5);
            }
            this.g.fillRect(snake.food.x*5, snake.food.y*5, 5, 5);
            this.g.fillStyle = "#222222";
            this.g.fillRect(snake.food.x*5, snake.food.y*5+2, 5, 1);
            this.g.fillRect(snake.food.x*5+2, snake.food.y*5, 1, 5);
        }
    }   
    drawGrid(){
        for(let i=1;i<100;i++){
            this.drawLine(i*5, 0, i*5, 500);
            this.drawLine(0, i*5, 500, i*5);
        }
    }
    drawBackground(){
        this.g.fillStyle = "#222222";
        this.g.fillRect(0, 0, 500, 500);
    }
    drawLine(x1,y1,x2,y2){
        this.g.beginPath();
        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);
        this.g.stroke();
    }
    
    setupButtons(){
        let button = document.getElementById("speed1");
        button.onclick = function(){
            renderer.targetIterCount = 1;
        }
        button = document.getElementById("speed2");
        button.onclick = function(){
            renderer.targetIterCount = 2;
        }
        button = document.getElementById("speed5");
        button.onclick = function(){
            renderer.targetIterCount = 5;
        }
        button = document.getElementById("speed10");
        button.onclick = function(){
            renderer.targetIterCount = 10;
        }
        button = document.getElementById("speedUncapped");
        button.onclick = function(){
            renderer.targetIterCount = 50000;
        }
        button = document.getElementById("renderDeadSnakes");
        button.onclick = function(){
            renderer.renderDeadSnakes = document.getElementById("renderDeadSnakes").checked;
        }
        
    }
    
    updateGraph(gen, data){
        this.graph.data.labels.push(gen);
        this.graph.data.datasets.forEach((element, i) => {
            element.data.push(data[i]);
        });
        this.graph.update();
        
    }
    
    setupGraph(){
        let canvas = document.getElementById("score-chart").getContext("2d");
        this.graph = new Chart(canvas, {
            type: 'line',
            data:{
                labels: [],
                datasets: [
                    {
                        label: "Top Score",
                        data: [],
                        fill: false,
                        borderColor: '#39FF14',
                        tension: 0.1,
                    },
                    {
                        label: "98th Percentile Score",
                        data: [],
                        fill: false,
                        borderColor: '#3914FF',
                        tension: 0.1,
                    },
                    {
                        label: "90th Percentile Score",
                        data: [],
                        fill: false,
                        borderColor: '#FF3914',
                        tension: 0.1,
                    }
                ]
            }
            
            
        });
    }
    randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

let renderer = new Render();
renderer.start();