class RenderNN{
    
    constructor(){
        this.g = document.getElementById("best-network-canvas").getContext("2d");
        
    }
    
    drawNetwork(net){
        this.g.fillStyle = "#222222";
        this.g.fillRect(0, 0, 1000, 500);
        let numLayers = net.topology.length;
        
        for(let i = 0;i<net.weightMatrices.length;i++){
            for(let j = 0;j<net.weightMatrices[i].length;j++){
                for(let k = 0;k<net.weightMatrices[i][j].length;k++){
                    let x1 = (i+1) * 1000.0 / (numLayers + 1);
                    let x2 = (i+2) * 1000.0 / (numLayers + 1);
                    let y1 = (k+1) * 500.0 / (net.weightMatrices[i][j].length + 1);
                    let y2 = (j+1) * 500.0 / (net.weightMatrices[i].length + 1);
                    this.drawWeight(x1, y1, x2, y2, net.weightMatrices[i][j][k]);
                }
            }
        }
        
        for(let i = 0;i<numLayers;i++){
            let x = (i+1) * 1000.0 / (numLayers + 1);
            for(let j = 0;j<net.topology[i];j++){
                let y = (j+1) * 500.0 / (net.topology[i] + 1);
                this.drawNode(x, y);
            }
        }
        
    }
    drawWeight(x1, y1, x2, y2, weight){
        let val = Math.abs(weight);
        val = Math.min(Math.round(val*255), 255).toString(16);
        if(weight > 0){
            this.g.strokeStyle = "#00"+val+"00";
        }else{
            this.g.strokeStyle = "#"+val+"0000";
        }
        val = Math.abs(weight);
        val = Math.max(Math.min(val*3, 3),1);
        this.g.lineWidth = val;      
        this.g.beginPath();
        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);
        this.g.stroke();
    }
   
    drawNode(x, y){
        this.g.beginPath();
        this.g.arc(x, y, 15, 0, 2 * Math.PI, false);
        this.g.fillStyle = '#333333';
        this.g.fill();
        this.g.lineWidth = 5;  
        this.g.strokeStyle = '#111111';
        this.g.stroke();
    }
    
}