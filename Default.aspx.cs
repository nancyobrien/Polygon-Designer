using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{

    public String projectID {
        get {
            if (Page.RouteData.Values["projectID"] != null) {
                return (Page.RouteData.Values["projectID"].ToString());
            } else {
                return "";
            }
        }
    }
    public String versionID {
        get {
            if (Page.RouteData.Values["versionID"] != null) {
                return (Page.RouteData.Values["versionID"].ToString());
            } else {
                return "";
            }
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {

        this.VersionID.Text = this.versionID;
        this.ProjectID.Text = this.projectID; 

    }
}