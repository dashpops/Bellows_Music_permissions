export class YoutubeIframeApi {
    private initialized: boolean = false;
    private static instance: YoutubeIframeApi;
    
    private constructor() {
        
    }
    
    //initialize function called during feature setup await YoutubeIFrameApi.initialize()
    //static initialized instance?
    //No need to have any instance of YoutubeIframeApi?
    //maybe for keeping track of playlists in an array? good use of state...
    public static async initialize() {
        if (this.getInstance()) {
            console.log("YoutubeApi Already initialized");
            return;
        }
        
        window.onYouTubeIframeAPIReady = function () {
            
            this.initialized = true;
            console.log(`Bellows | YoutubeIframeApi successfully initialized`);
            const event = new Event("BellowsYoutubeApiReady");
            document.dispatchEvent(event);
        };
        
        if (!$("#yt-api-script").length) {
            const tag = document.createElement("script");
            tag.id = "yt-api-script";
            tag.src = "https://www.youtube.com/iframe_api";
            tag.type = "text/javascript";
            
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            console.log("Bellows | Downloading YoutubeIframeApi...");
        }   
    }
    
    public static getInstance(): YoutubeIframeApi {
        if (!YoutubeIframeApi.instance) {
            YoutubeIframeApi.instance = new YoutubeIframeApi();
        }
        
        return this.instance;
    }
    
    async getPlayerById(id: string): Promise<YT.Player> {
        
    }
    
    async createPlayer(): Promise<YT.Player> {
        const ytplayer = new Promise<YT.Player>((resolve, reject) => {
            if (!this.initialized) {
                document.addEventListener("BellowsYoutubeApiReady", (e) => {
                    resolve(new YT.Player());
                    document.removeEventListener("BellowsYoutubeApiReady",)
                });
            }
        });
        
        
        
        return Promise.race([
            ytplayer,
            timeout
        ]);
    }
}