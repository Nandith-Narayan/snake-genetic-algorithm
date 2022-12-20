class Network{
    
    constructor(){
        this.topology = [7, 10, 10, 4]
        this.buildNetwork(this.topology);
        
    }
    /* Creates weight matricies and initializes them with random weights */
    buildNetwork(topology){
        this.weightMatrices = [];
        for(let i=0;i<topology.length-1;i++){
            let matrix = [];
            let numRows = topology[i+1];
            let numCols = topology[i];
            for(let r=0;r<numRows;r++){
                let row = [];
                for(let c=0;c<numCols;c++){
                    row.push(this.generateRandomWeight());
                }
                matrix.push(row);
            }
            this.weightMatrices.push(matrix);
        }
       
    }
    /* Computes the output of the network given the inputs */
    forwardPass(input){
        let x = input;
        for(let mat of this.weightMatrices){
            x = this.matrixMultiply(mat, x);
        }
        return x;
    }
    /* Just regular Matrix multiplication, nothing to see here :P */
    matrixMultiply(A, B){
        let rows = A.length;
        let cols = B[0].length;
        let n = B.length;
        let result = []
        for(let r=0; r<rows; r++){
            let row = []
            for(let c=0; c<cols; c++){
                let val = 0;
                for(let k=0;k<n;k++){
                    val += A[r][k] * B[k][c];
                }
                row.push(val);
            }
            result.push(row)
        }
        return result;
    }
    // Generates random number in range (-1, 1)
    generateRandomWeight(){
        return Math.random()*2 -1;
    }
    
    
}