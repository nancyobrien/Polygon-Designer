<%@ WebHandler Language="C#" Class="GetVersion" %>

using System;
using System.Web;

public class GetVersion : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
                string projectID = Stepframe.Common.GetRequestVar("projectID");
        string versionID = Stepframe.Common.GetRequestVar("versionID");

        FileIO.Project thisProject = new FileIO.Project(projectID);
        FileIO.Version thisVersion = thisProject.GetVersion(versionID);
        
        context.Response.ContentType = "text/plain";
        context.Response.Write(thisVersion.Vertices);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}