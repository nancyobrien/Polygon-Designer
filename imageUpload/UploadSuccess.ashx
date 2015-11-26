<%@ WebHandler Language="C#" Class="UploadSuccess" %>
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Security.Cryptography;

using System.Text;
using System.IO;

using Amazon;
using Amazon.S3;
using Amazon.S3.Model;


public class UploadSuccess : IHttpHandler {

    public void ProcessRequest(HttpContext context) {
        context.Response.ContentType = "application/json";
      //  context.Response.Write(verifyFileInS3(context));
        string tempLink = "http://s3.amazonaws.com/covidienbenefits/";
        context.Response.Write("{\"tempLink\":\"" + tempLink  + "\"}");
    }

    public bool IsReusable {
        get {
            return false;
        }
    }


    public string verifyFileInS3(HttpContext context) {

        string bucket = context.Request["bucket"];
        string key = context.Request.QueryString["key"];
        string keys = String.Empty;
        foreach (string s in context.Request.Form.Keys) {
            keys += s.ToString();
        }
        if (bucket != SignaturePolicy.BucketName) {
            return "{\"error\":\"Invalid Request xxx " + keys + " \"}";
        } else if ((SignaturePolicy.ExpectedMaxSize != String.Empty) && (getObjectSize(key) > Convert.ToInt64(SignaturePolicy.ExpectedMaxSize))) {
            return "{\"error\":\"File is too big\"}";
        } else {
            return "{\"tempLink\":\"" + getTempLink(bucket, key) + "\"}";
        }


    }

    // Provide a time-bombed public link to the file.
    public string getTempLink(string bucket, string key) {
        return "http://s3.amazonaws.com/" + bucket + "/" + key;

    }

    public long getObjectSize(string key) {
        AmazonS3Client s3 = SignaturePolicy.s3;
        var req = new GetObjectRequest();
        req.BucketName = SignaturePolicy.BucketName;
        req.Key = key;
        return s3.GetObject(req).Headers.ContentLength;

    }

}