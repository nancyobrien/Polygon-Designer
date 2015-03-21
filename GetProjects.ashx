<%@ WebHandler Language="C#" Class="GetProjects" %>

using System;
using System.Web;
using System.Collections.Generic;

public class GetProjects : IHttpHandler {

    public void ProcessRequest(HttpContext context) {
        context.Response.ContentType = "text/plain";
        context.Response.Write(FileIO.ProjectsJSON());
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}