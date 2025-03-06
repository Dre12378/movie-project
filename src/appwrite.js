import {Client, Databases, ID, Query} from "appwrite";

const PROJECT_KEY = import.meta.env.VITE_APPWRITE_KEY;
const DATABASE_KEY = import.meta.env.VITE_DB_KEY;
const METRIC_KEY = import.meta.env.VITE_METRIC_KEY;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_KEY);

const database = new Databases(client);

export const updateSearchCount = async (search, movie) => {
    try{
        const result = await database.listDocuments(DATABASE_KEY, METRIC_KEY,[Query.equal('search',search),
        ]);

        if(result.documents.length > 0){
            const documents = result.documents[0];
            await database.updateDocument(DATABASE_KEY,METRIC_KEY,documents.$id,{count: documents.count + 1})

        }
        else{
            await database.createDocument(DATABASE_KEY,METRIC_KEY, ID.unique(),{
                search,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            })
        }
    }
    catch(e){
        console.log("Error API:" + e);
    }
}

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(DATABASE_KEY, METRIC_KEY,
            [
                Query.limit(5),
                Query.orderDesc("count")
            ]);
        return result.documents;
    }
    catch(e){
        console.log("Error Trending Movies:" + e);
    }
}