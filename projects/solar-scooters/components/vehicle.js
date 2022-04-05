class VehiclePursue {
    constructor(x, y, p, journey, count,d) {
        this.p = p;
        this.position = p.createVector(x, y);
        this.d = d;
        this.max = count;
        this.maxSegment =10;
        this.journey = journey;
        this.currentTime = 0;
        this.start = [this.position.x, this.position.y];
        this.historySet = new Set();
        this.history = [this.p.createVector(...this.start)];
        this.color = [51,51,51, 126];
        this.size = 4

    }
    update() {

        if(this.d[currentScenario] === "2"){
            this.color = [171, 5, 13, 126];
            this.size = 6
        }else if(this.d[currentScenario] === "1"){
            this.color = [89, 94, 98, 126];
            this.size = 4;
        }else{
            this.color = [51,51,51, 126];
            this.size = 4;
        }
        if(isSmallScreen)this.size = this.size*0.6;
        


        if (this.currentTime >= this.max) {
        	this.currentTime = 0;
        	this.history = []
            
        } 
        this.position.set(this.journey[this.currentTime]);

        
        let v = this.p.createVector(this.position.x, this.position.y);

        this.history.unshift(v)
        if (this.history.length >= this.maxSegment) {
            this.history.splice(-1, 1);
        }
        this.currentTime++;

    }
    display() {

        this.p.beginShape();
        this.p.stroke(...this.color);
        
        this.p.strokeWeight(this.size-2)
        this.history.forEach((d,i) => {
            this.p.noFill();
            this.p.vertex(d.x, d.y);
        })
        this.p.endShape();
        
        
        this.p.noStroke();
        this.p.fill(...this.color);
        this.p.ellipse(this.position.x, this.position.y, this.size);


    }
}