<%@ WebHandler Language="C#" Class="ArchiveProject" %>

using System;
using System.Web;

public class ArchiveProject : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        string projectID = Stepframe.Common.GetRequestVar("projectID");


        FileIO.Project thisProject = new FileIO.Project(projectID);

        thisProject.ArchiveProject();

        context.Response.ContentType = "text/plain";
        context.Response.Write(FileIO.ProjectsJSON());
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}