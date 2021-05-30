using System;
using System.IO;

namespace System.IO
{
    public static class StreamExtension
    {
        public static byte[] ToBytes(this Stream input)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                input.CopyTo(ms);
                return ms.ToArray();
            }
        }      
    }
}
