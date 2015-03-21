<%@ WebHandler Language="C#" Class="FileHandler" %>

using System;
using System.Web;

public class FileHandler : IHttpHandler {


    public void ProcessRequest(HttpContext context) {
        string projectID = Stepframe.Common.GetRequestVar("projectID");
        string projectName = Stepframe.Common.GetRequestVar("projectName");
        string versionName = Stepframe.Common.GetRequestVar("versionName");
        string versionSummary = Stepframe.Common.GetRequestVar("versionSummary");
        string projectJSON = Stepframe.Common.GetRequestVar("projectJSON");

        FileIO.Project thisProject = new FileIO.Project(projectID, projectName, versionName);
 


        if (context.Request.Files.Count > 0) {
            HttpFileCollection files = context.Request.Files;
            foreach (string key in files) {
                HttpPostedFile file = files[key];
                thisProject.AddImage(file);
            }
        }

        thisProject.AddVersion(versionName, versionSummary, projectJSON);
        
        context.Response.ContentType = "text/plain";
        context.Response.Write(thisProject.JSON()); 

    }



    public bool IsReusable {
        get {
            return false;
        }
    }

}