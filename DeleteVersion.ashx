<%@ WebHandler Language="C#" Class="DeleteVersion" %>

using System;
using System.Web;

public class DeleteVersion : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        string projectID = Stepframe.Common.GetRequestVar("projectID");
        string versionID = Stepframe.Common.GetRequestVar("versionID");

        FileIO.Project thisProject = new FileIO.Project(projectID);

        thisProject.DeleteVersion(versionID);

        context.Response.ContentType = "text/plain";
        context.Response.Write(thisProject.JSON());
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}