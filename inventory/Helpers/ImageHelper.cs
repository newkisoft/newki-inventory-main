using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace inventory
{
    public static class ImageHelper
    {

        public static Image ResizeImage(byte[] bytes, Size size)
        {
            using(var stream = new MemoryStream(bytes))
            using (var image = Image.FromStream(stream))
            {
                return (Image)(new Bitmap(image, size));
            }
        }
    }
}
