// Customer : Center for Disease Control
// Version : Image Highlighting 1.1

    var imgName;

    function mOver(imgName)
    {
        if (document.images) 
        {
            document.images[imgName].src="../i/" + imgName + "_on.gif"
        }
    }

    function mOut(imgName)
    {
        if (document.images) 
        {
            document.images[imgName].src="../i/" + imgName + ".gif"
        }
    }

