using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using Stepframe;
using System.Web.Script.Serialization;
using System.Drawing;


/// <summary>
/// Summary description for FileIO
/// </summary>
public class FileIO {
    //private static string versionStructure = "{\"versions\": [{\"name\": \"xx\", \"date\": \"xxx\"}]}";
    //private static string versionRecord = "{\"name\": \"{%versionName%}\", \"date\": \"{%versionDate%}\"}";
    public static String UploadPath = "~/uploads/";
    public static String TempPath = "~/uploads/tmpfiles/";
    public static String ArchivePath = "~/uploads/archive/";
    public static string ArchiveMapPath {
        get {
            return Stepframe.Common.context.Server.MapPath(ArchivePath);
        }
    }
    public FileIO() {
        //
        // TODO: Add constructor logic here
        //
    }

    public static Project CreateProject(string projectName, string versionName) {
        string projectID = Guid.NewGuid().ToString("N");
        return new Project(projectID, projectName, versionName);
    }


    public static List<Project> GetProjects() {
        List<Project> projects = new List<Project>();
        string[] dirs = System.IO.Directory.GetDirectories(Common.context.Server.MapPath(UploadPath));
        foreach (string dir in dirs) {
            if (dir.ToLower() != ArchiveMapPath.ToLower().TrimEnd('\\') && !dir.ToLower().Contains("tmpfiles")) {
                projects.Add(GetProject(dir));
            }
        }
        return projects;
    }

    public static Project GetProject(string projectDir) {
        System.IO.DirectoryInfo dirInfo = new System.IO.DirectoryInfo(projectDir);
        string projectID = dirInfo.Name;
        return new Project(projectID);
    }

    public static string ProjectsJSON() {
        return JSONHelper.ToJSON(GetProjects());
    }

    public class Project {

        private String MapPath {
            get {
                string mapPath = this.Path;
                try {
                    mapPath = Stepframe.Common.context.Server.MapPath(this.Path);
                } catch (HttpException) {
                    //Do nothing, let it fall back to the path;
                }
                return mapPath;
            }
        }
        public string Path {
            get {
                return UploadPath + this.ProjectID + "/";
            }
        }
        public string ProjectID { get; set; }
        public string ProjectName { get; set; }
        public DateTime CreationDate { get; set; }


        private string _imageName;
        public string ImageName {
            get {
                return _imageName;
            }
            set {
                if (_imageName != value) {
                    _imageName = value;
                    if (_imageName == "blob") { _imageName = "DefaultImage.png"; }
                    this.WriteProjectData();
                }

            }
        }

        public string ImagePath {
            get {
                return (this.Path + this.ImageName).Replace("~", String.Empty);
            }
        }


        public string Thumbnail {
            get {
                if (!File.Exists(this.MapPath + "thumbnail.png")) {
                    this.CreateThumbnail();
                }
                return (this.Path + "thumbnail.png").Replace("~", String.Empty);
            }
        }
        public List<Version> Versions { get; set; }

        public Project() { this.ProjectID = Guid.NewGuid().ToString("N"); }

        public Project(string projectName, string versionName) {

            this.ProjectID = Guid.NewGuid().ToString("N");
            this.ProjectName = projectName;

            if (!System.IO.Directory.Exists(this.MapPath)) {
                System.IO.Directory.CreateDirectory(this.MapPath);
                this.CreationDate = DateTime.Now;
                this.CreateProjectFile();
            }
            this.GetProjectInfo();

        }

        public Project(string projectID, string projectName, string versionName) {


            if (projectID == String.Empty || projectID.Length < 32) {
                projectID = Guid.NewGuid().ToString("N");
            }

            this.ProjectID = projectID;
            this.ProjectName = projectName;

            if (!System.IO.Directory.Exists(this.MapPath)) {
                System.IO.Directory.CreateDirectory(this.MapPath);
                this.CreationDate = DateTime.Now;
                this.CreateProjectFile();
            }
            this.GetProjectInfo();
        }


        public Project(string projectID) {
            this.ProjectID = projectID;
            this.GetProjectInfo();
        }

        public string JSON() {
            return JSONHelper.ToJSON(this);
        }

        public void GetProjectInfo() {
            System.IO.DirectoryInfo dirInfo = new System.IO.DirectoryInfo(this.MapPath);

            dynamic jsonObj = GetJSONData();
            if (jsonObj != null) {
                this.ProjectName = jsonObj.ProjectName;
                this.CreationDate = jsonObj.CreationDate;
                this._imageName = jsonObj.ImageName;  //Dont trigger the file write
                if (jsonObj.Versions != null) {
                    this.Versions = new List<Version>();
                    foreach (dynamic ver in jsonObj.Versions) {
                        this.Versions.Add(new Version(ver, this.Path));
                    }

                    this.Versions.Sort((a, b) => -1 * a.CreationDate.CompareTo(b.CreationDate));
                }
            }
        }

        public void CreateProjectFile() {
            this.WriteProjectData();
        }

        public void ArchiveProject() {
            string archiveMapPath = Stepframe.Common.context.Server.MapPath(ArchivePath);
            if (!Directory.Exists(archiveMapPath)) {
                Directory.CreateDirectory(archiveMapPath);
            }
            Directory.Move(this.MapPath, archiveMapPath.TrimEnd('/') + "/" + this.ProjectID);
        }

        public void DeleteVersion(string versionID) {
            Version delVersion = null;
            foreach (Version ver in this.Versions) {
                if (ver.Date == versionID) {
                    delVersion = ver;
                }
            }
            if (delVersion != null) { this.Versions.Remove(delVersion); }
            this.WriteProjectData();
        }

        public Version GetVersion(string versionID) {
            Version selectedVersion = null;
            foreach (Version ver in this.Versions) {
                if (ver.Date == versionID) {
                    selectedVersion = ver;
                }
            }

            return selectedVersion;
        }

        public void FavoriteVersion(string versionID) {
            foreach (Version ver in this.Versions) {
                if (ver.Date == versionID) {
                    ver.isFavorite = true;
                } else {
                    ver.isFavorite = false;
                }
            }

            this.WriteProjectData();
        }
   

        public string AddImage(HttpPostedFile image) {
            this.ImageName = image.FileName;
            image.SaveAs(this.MapPath + this.ImageName);
            
            this.CreateThumbnail();

            return this.ImageName;
        }

        public string AddSVG(string versionID, string base64String) {
            string svgFile = this.MapPath + "SVG--" + versionID + ".svg";
            Stepframe.FileUtilities.WriteFile(this.MapPath + "SVG--" + versionID + ".svg", base64String);

            return svgFile;
        }

        private void WriteProjectData() {
            string fileName = this.MapPath + "project.json";
            StreamWriter sw = File.CreateText(fileName);

            string projectJSON = JSONHelper.ToJSON(this);
            sw.Write(projectJSON);
            sw.Close();
        }

        private dynamic GetJSONData() {
            return JSONHandler.JSONReader.ReadData(this.MapPath + "project.json");
        }

        public static string FilepathToURL(string filePath) {
            string filenameRelative = filePath.Replace(Common.context.Server.MapPath(FileIO.UploadPath), FileIO.UploadPath);
            return VirtualPathUtility.ToAbsolute(filenameRelative);
        }

        public void AddVersion(string name, string summary, string json) {
            if (this.Versions == null) { this.Versions = new List<Version>(); }

            Version newVersion = new Version(name, summary, this.Path, json);
            this.Versions.Add(newVersion);
            this.WriteProjectData();
        }


        private void CreateThumbnail() {
            SaveSmallImage(this.MapPath + this.ImageName, this.MapPath + "thumbnail.png");
            /*if (File.Exists(this.MapPath + this.ImageName)) {
                Image tempImage = Image.FromFile(this.MapPath + this.ImageName);
                double imgRatio = Convert.ToDouble(tempImage.Height) / Convert.ToDouble(tempImage.Width);
                double width = 300;
                double height = imgRatio * width;
                if (height > 300) {
                    height = 300;
                    width = height / imgRatio;
                }
                Image thumb = tempImage.GetThumbnailImage(Convert.ToInt32(width), Convert.ToInt32(height), () => false, IntPtr.Zero);
                thumb.Save(this.MapPath + "thumbnail.png", System.Drawing.Imaging.ImageFormat.Png);
                tempImage.Dispose();
                thumb.Dispose();
                
            }*/

        }



        private static void SaveSmallImage(string inputFilePath, string outputFilename) {
            if (File.Exists(inputFilePath)) {
                Image tempImage = Image.FromFile(inputFilePath);
                double imgRatio = Convert.ToDouble(tempImage.Height) / Convert.ToDouble(tempImage.Width);
                double width = 300;
                double height = imgRatio * width;
                if (height > 300) {
                    height = 300;
                    width = height / imgRatio;
                }
                Image thumb = tempImage.GetThumbnailImage(Convert.ToInt32(width), Convert.ToInt32(height), () => false, IntPtr.Zero);
                thumb.Save(outputFilename, System.Drawing.Imaging.ImageFormat.Png);
                tempImage.Dispose();
                thumb.Dispose();

            }

        }

    }

    public class Version {

        private string _name;
        public string Name {
            get {
                if (_name == String.Empty) {
                    _name = "Version " + this.Date;
                }
                return _name;
            }
            set {
                _name = value;
            }
        }
        public string Summary { get; set; }

        private string _date = String.Empty;
        public string Date {
            get {
                if (_date == String.Empty) {
                    _date = DateTime.Now.ToString("MMddyyyy-HHmmss");
                }
                return _date;
            }
            set {
                _date = value;
            }
        }

        public DateTime CreationDate {
            get {
                return DateTime.Parse(this.DateDisplay);
            }
        }
        public String DateDisplay {
            get {
                return convertDate(this.Date);
            }
        }

        public string Path { get; set; }
        public Boolean isFavorite { get; set; }

        public Boolean ShowVertices { get; set; }
        public Boolean ShowStroke { get; set; }
        public Boolean ShowAllStrokes { get; set; }
        public Boolean ShowFill { get; set; }
        public Boolean UseGradientFill { get; set; }

        [ScriptIgnore]
        public string Vertices { get; set; }

        public string DataPath {
            get {
                return (this.Path + "data--" + this.Date + ".json").Replace("~", String.Empty);
            }
        }

        private String Filename {
            get {
                string mapPath = this.DataPath;
                try {
                    mapPath = Stepframe.Common.context.Server.MapPath(this.DataPath);
                } catch (HttpException) {
                    //Do nothing, let it fall back to the path;
                }
                return mapPath;
            }
        }

        public Version(string jsonFile) {
            this.Path = Project.FilepathToURL(jsonFile);
            dynamic verData = JSONHandler.JSONReader.ReadData(jsonFile);
            if (verData.GetType().GetProperty("Name") != null) {
                this.Name = verData.Name;
            } else {
                this.Name = "Data";
            }
            if (verData.GetType().GetProperty("Date") != null) {
                this.Date = verData.Date;
            } else {
                string fileName = jsonFile.Substring(jsonFile.IndexOf("data-"));

                this.Date = convertDate(fileName.Replace("data--", String.Empty).Replace(".json", String.Empty));
            }

            this.Vertices = Stepframe.FileUtilities.ReadFile(this.Filename);

        }
        public Version(string name, string summary, string filePath, string json) {
            this.Name = name;
            this.Summary = summary;
            this.Path = filePath;

            System.IO.StreamWriter sw = System.IO.File.CreateText(this.Filename);
            sw.Write(json);
            sw.Close();

            this.Vertices = Stepframe.FileUtilities.ReadFile(this.Filename);

        }

        public Version(dynamic VersionJSON, string filePath) {
            this.Name = VersionJSON.Name;
            this.Summary = VersionJSON.Summary;
            this.Date = VersionJSON.Date;
            this.Path = filePath;
            this.isFavorite = VersionJSON.isFavorite;
            this.Vertices = Stepframe.FileUtilities.ReadFile(this.Filename);
        }

        private string convertDate(string dateString) {
            string[] dateparts = dateString.Split('-');
            int month = Convert.ToInt32(dateparts[0].Substring(0, 2));
            int day = Convert.ToInt32(dateparts[0].Substring(2, 2));
            int year = Convert.ToInt32(dateparts[0].Substring(4, 4));
            int hr = Convert.ToInt32(dateparts[1].Substring(0, 2));
            int min = Convert.ToInt32(dateparts[1].Substring(2, 2));
            int sec = Convert.ToInt32(dateparts[1].Substring(4, 2));

            DateTime dateObj = new DateTime(year, month, day, hr, min, sec);
            return dateObj.ToString("MM/dd/yyyy HH:mm:ss");
        }

    }
}