import { tavily as Tavily } from "@tavily/core"

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export async function searchWeb({query}){
    try{
        const response = await tavily.search(query,{
            max_results: 5,
            searchDepth:"advanced"
        });
        return JSON.stringify(response);

    }catch(err){
        console.log(err);
    }
    
}