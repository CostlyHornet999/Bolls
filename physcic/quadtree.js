import { visibleWidth, visibleHeight } from "../config.js";


export class Rectangle{
    constructor(x,y,w,h){ // (x,y) is center, (w,h) is total width and height
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hw = w/2;
        this.hh = h/2
    }

    contains(point) { // Checks if there's a given point inside
        return (
            //checks if point is within the x axis
            point.x >= this.x - this.hw &&
            point.x <  this.x + this.hw && 
            // checks if point is within the y axis
            point.y >= this.y - this.hh &&
            point.y <  this.y + this.hh
        );
    }

    // checks if 2 rectangles overlap
    containsRect(range) {
        return (
            this.x - this.hw < range.x-range.w/2 &&
            this.x + this.hw > range.x+range.w/2 &&
            this.y - this.hh < range.y-range.h/2 &&
            this.y + this.hh > range.y+range.h/2
        ) 
    }
    intersects(range) {
        const left   = this.x - this.hw;
        const right  = this.x + this.hw;
        const top    = this.y - this.hh;
        const bottom = this.y + this.hh;

        const rLeft   = range.x - range.w/2;
        const rRight  = range.x + range.w/2;
        const rTop    = range.y - range.h/2;
        const rBottom = range.y + range.h/2;
        
        // if all of the sides 100% don't overlap, they don't overlap
        return !(rRight < left || rLeft > right || rBottom < top || rTop > bottom);
    }
}


export class QuadTree {
    constructor(boundary, capacity = 4, maxDepth = 600) {
        this.boundary = boundary;
        this.capacity = capacity;

        this.depth = 0;
        this.maxdepth = maxDepth;

        // First grid is empty
        this.points = [];
        this.divided = false;

        this.NW = null;
        this.NE = null;
        this.SW = null;
        this.SE = null;
    }

    // This recursively splits the grid into 4 equal pieces
subDivide() {
    const { x, y, hw, hh } = this.boundary;
    this.NW = new QuadTree(
        new Rectangle(x - hw/2, y - hh/2, hw, hh),
        this.capacity,
    ); this.NW.depth = this.depth+1
    this.NE = new QuadTree(
        new Rectangle(x + hw/2, y - hh/2, hw, hh),
        this.capacity,
    ); this.NE.depth = this.depth+1
    this.SW = new QuadTree(
        new Rectangle(x - hw/2, y + hh/2, hw, hh),
        this.capacity,
    ); this.SW.depth = this.depth+1
    
    this.SE = new QuadTree(
        new Rectangle(x + hw/2, y + hh/2, hw, hh),
        this.capacity,
        
    ); this.SE.depth = this.depth+1 

    this.divided = true;
}

    insert(point) {
        // Is the point relevant?
        if (!this.boundary.contains(point)){
            
            return false;
        }
        // If the point is in a free grid, just place it in there
        // Or if the grid has reached max depth.
        if (this.points.length < this.capacity && !this.divided || this.depth >= this.maxdepth) {
            this.points.push(point);
            return true
        }

        // If the grid capacity is overloaded, we split it into 4 smaller grids
        // Once it becomes a parent, it just off loads all responsibility to its kids
        if (!this.divided) {

            this.subDivide();

            // Unload the points unto the respective kids
            for (const p of this.points) {
                this._insertToChild(p);
            }
            this.points = []; // Then remove all memory of them


           
            
        }
         // Once this ticks over as true, the recursion will escape
        return this._insertToChild(point)
    }
    _insertToChild(point) {
        return (
            // Basically recursively runs the Insert function on all quadrants, until it finally finds one that has space
            this.NW.insert(point) ||
            this.NE.insert(point) ||
            this.SW.insert(point) ||
            this.SE.insert(point)
        )
    }
    _collectALL(found) {
        if(!this.divided){
            //Triple dot is a mini for loop that iterates each array member
            found.push(...this.points)
        } else {
            this.NW._collectALL(found);
            this.NE._collectALL(found);
            this.SW._collectALL(found);
            this.SE._collectALL(found);
        }
    }

    Query(range, found = []) {
        // Quick Paths
        // If we're no longer intersecting with query, leave
        if (!this.boundary.intersects(range)){
            return found
        }
        // If a node is fully contained in range
        //if (range.containsRect(this.boundary)){
        //    this._collectALL(found);
        //    return found;
        //}


        // Only search for points if this is a leaf/child grid 
        // Otherwise we go DEEPER
        if (!this.divided) {
            for (const p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
        } else {
            this.NW.Query(range, found);
            this.NE.Query(range, found);
            this.SW.Query(range, found);
            this.SE.Query(range, found);
        }

        return found;
    }

    draw(ctx) {
        const {x, y, w, h} = this.boundary;
        ctx.strokeStyle = "#3a0000";
        ctx.strokeRect(x-w/2-visibleWidth/2, y-h/2-visibleHeight/2, w, h);

        if (this.divided) {
            this.NW.draw(ctx);
            this.NE.draw(ctx);
            this.SW.draw(ctx);
            this.SE.draw(ctx);
        } 
        else if (this.points.length > 0) {
            ctx.fillStyle = "rgba(255,100,100,0.4)";
            ctx.fillRect(x-w/2-visibleWidth/2, y-h/2-visibleHeight/2, w, h);
        }
    }
}