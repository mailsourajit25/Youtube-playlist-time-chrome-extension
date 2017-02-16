
    //Animation
    setTimeout(showPage, 2000);
    function showPage() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("playlist").style.display = "block";
        document.getElementById("show").style.display = "block";
    }
    //Global variables
    var hr=0,min=0,sec=0,day=0;

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4)
        {
            if (xhr.status==200) {
                var i,j,listurl,count=0;
                var maindoc = document.implementation.createHTMLDocument('');
                maindoc.open();
                maindoc.write(xhr.responseText);
                var loadmore=maindoc.getElementsByClassName("load-more-text");
                // while(loadmore.length!=0)
                // {
                //     loadmore[0].click();
                //     loadmore=maindoc.getElementsByClassName("load-more-text");
                // }
                //This is executed when search in youtube yields playlists 
                var playlist=maindoc.getElementsByClassName("yt-lockup-content");
                //This is executed to get the playlist time from the playing video page of the playlist
                var vidpage=maindoc.getElementsByClassName("playlist-info");
                //This is executed when we are in the main playlist page
                var playlistpage=maindoc.getElementsByClassName("pl-header-title");

                if (playlist.length!=0) {
                    for(i=0;i<playlist.length;i++)
                     {
                        var link=playlist[i].getElementsByTagName("a");
                        for(j=0;j<link.length;j++)
                        {
                            if(link[j].href.includes(href="/playlist?list="))
                            {
                                count++;
                                if(count>1)
                                    document.getElementById("playlist").innerHTML=count+" <em style='color:#39e600'>Playlists Found </em>: <hr>";
                                else
                                    document.getElementById("playlist").innerHTML=count+" <em style='color:#39e600'>Playlist Found </em>: <hr>";
                                listurl=link[j].href.split("/playlist?list=");
                                docmaker("/playlist?list="+listurl[1]);
                            }         
                        }  
                     }if(count==0)
                        document.getElementById("show").innerHTML="No Playlists Found !!";
                }
                else if(vidpage.length!=0)
                {
                    var link=vidpage[0].getElementsByTagName("a")[0];
                    listurl=link.href.split("/playlist?list=");
                    document.getElementById("playlist").innerHTML=" <em style='color:#39e600'>Playlist Found </em>: <hr>";
                    docmaker("/playlist?list="+listurl[1]);
                } 
                else if(playlistpage.length!=0)
                {
                    document.getElementById("playlist").innerHTML=" <em style='color:#39e600'>Playlist Found </em>: <hr>";
                    playlisthandler(maindoc);
                }
                else
                    document.getElementById("show").innerHTML="No Playlists Found !!";  
                    
                maindoc.close();
            }
            else
                document.getElementById("show").innerHTML="Sorry !! works only for Youtube";

        }
    } 
        xhr.open("GET",tabs[0].url,true);
        xhr.send();
        
     });

    function addtime(str)
    {
        str=str.toString();
        var pt=str.split(":");
        for(var i=0;i<pt.length;i++)
        {
            pt[i]=parseInt(pt[i]);
        }
        
        if(pt.length==4)
        {
            day+=pt[0];
            hr+=pt[1];
            min+=pt[2];
            sec+=pt[3];
        }
        else if(pt.length==3)
        {
            hr+=pt[0];
            min+=pt[1];
            sec+=pt[2];   
        }
        else if(pt.length==2)
        {
            min+=pt[0];
            sec+=pt[1];    
        }
        else
            sec+=pt[0];
        
        if(sec>=60)
        {
            sec=sec-60;
            min+=1;
        }

        if(min>=60)
        {
            min=min-60;
            hr+=1;
            
        }
        
        if(hr>=24)
        {
            day+=1;
            hr=hr-24;
        }
    }

    function printtime(){
        if(day!=0)
        {
            if(day>1)
                document.getElementById("show").innerHTML+=day+" Days ";
            else
                document.getElementById("show").innerHTML+=day+" Day ";
        }
            
        if(hr!=0)
        {
            if(hr>1)
                document.getElementById("show").innerHTML+=hr+" Hours ";
            else
                document.getElementById("show").innerHTML+=hr+" Hour ";
        }
            
        if(min!=0)
        {
            if(min>1)
                document.getElementById("show").innerHTML+=min+" Minutes ";
            else
                document.getElementById("show").innerHTML+=min+" Minute ";
        }
            
        if(sec!=0)
        {
            if(sec>1)
                document.getElementById("show").innerHTML+=sec+" Seconds ";
            else
                document.getElementById("show").innerHTML+=sec+" Seconds ";
        }
          
          document.getElementById("show").innerHTML+="<hr/>";              
    }

function playlisthandler(itemdoc)
{
    hr=0,min=0,sec=0,day=0;
    var list;
    var title=itemdoc.getElementsByClassName("pl-header-title")[0].innerHTML;
    document.getElementById("show").innerHTML+="<em style='color:orange'> Name </em>:<span style='color:#4d94ff'>"+title+"</span><br><em style='color:orange'> Total Playtime </em>: ";
    list=itemdoc.getElementsByClassName("pl-video-time"); 
    var totalvids=itemdoc.getElementsByClassName("pl-header-details")[0].getElementsByTagName("li")[1].innerHTML;  
    totalvids=parseInt(totalvids.replace ( /[^\d.]/g, '' ));//Removing the string part and parsing as int
    var item,timestamp,playtime;
    playtime="";
    if(list.length==100 && list.length!=totalvids)
    	document.getElementById("show").innerHTML+="<em style='color:red'>(Till 100 videos)</em><br>";
    for(item=0;item<list.length;item++)
    {
        timestamp=list[item].getElementsByClassName("timestamp");
        if (typeof(timestamp[0])!='undefined')
        {
            playtime=timestamp[0].getElementsByTagName("span")[0].innerHTML;
            addtime(playtime);    
        }
        
    }
    printtime();
}

function docmaker(url)
{
    
    var listxhr=new XMLHttpRequest();
    listxhr.onreadystatechange=function(){
        if(listxhr.readyState==4 && listxhr.status==200)
        {
            var listdoc = document.implementation.createHTMLDocument('');
            listdoc.open();
            listdoc.write(listxhr.responseText);
            playlisthandler(listdoc);
        }
    }

    listxhr.open("GET","https://www.youtube.com/"+url,true);
    listxhr.send();
}
