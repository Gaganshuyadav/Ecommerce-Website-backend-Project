class ApiFeature{
    constructor( productSchema , query){
        this.productSchema = productSchema;
        this.query = query;
    }

    async search(){
        const keyword = this.query.keyword ? { name: { $regex: this.query.keyword, $options: "i" } } : {} ;
        const query = await this.productSchema.find({...keyword} );       //to use copy not take reference, otherwise the change occurs in original
       
        return query;
    }

    async filter(){
        const queryCopy = {...this.query};   

        // Removing some fields for price
        const removefields = ["keyword", "page", "limit", "category"];
        removefields.forEach( (key)=> delete queryCopy[key]);

        // Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace( /\b(gt|lt|gte|lte)\b/g, (key)=> `$${key}`);
        queryStr = JSON.parse(queryStr);

        
        let filter = await this.productSchema.find(queryStr);
    
        return filter;
        
        
    }

    async pagination(resultPerPage){
        const currPage = Number(this.query.page) || 1;
        const skip = resultPerPage*( currPage-1);
        let page = await this.productSchema.find().skip( skip).limit( resultPerPage);
        return page;
    }

   
}


module.exports = ApiFeature;