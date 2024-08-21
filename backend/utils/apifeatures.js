class ApiFeature{
    constructor( query , queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
        const keyword = this.queryString.keyword ? 
        { name: { $regex: this.queryString.keyword, $options: "i" } } : {} ;
       
        this.query = this.query.find({...keyword} );       //to use copy not take reference, otherwise the change occurs in original
        return this;
    }

    filter(){
        const queryCopy = {...this.queryString};    

        // Removing some fields for price
        const removefields = ["keyword", "page", "limit"];
        removefields.forEach( (key)=> delete queryCopy[key]);

        // Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace( /\b(gt|lt|gte|lte)\b/g, (key)=> `$${key}`);
        queryStr = JSON.parse(queryStr);
        console.log(queryStr);
        
        this.query = this.query.find(queryStr);
    
        return this;
        
        
    }

    pagination(resultPerPage){
        const currPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage*( currPage-1);
        this.query = this.query.find().skip(skip).limit(resultPerPage);
        return this;
    }

   
}


module.exports = ApiFeature;