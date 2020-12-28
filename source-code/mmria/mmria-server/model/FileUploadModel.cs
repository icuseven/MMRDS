using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace mmria.server.model
{
    public class FileUploadModel
    {
        [MaxFileSize(5 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".fet" })]
        [Required]
        [Display(Name ="FET File Upload: ")]
        public IFormFile FileUpload_FET { get; set; }

        [MaxFileSize(5 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".nat" })]
        [Required]
        [Display(Name = "NAT File Upload: ")]
        public IFormFile FileUpload_NAT { get; set; }

        [MaxFileSize(5 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".mor" })]
        [Required]
        [Display(Name = "MOR File Upload: ")]
        public IFormFile FileUpload_MOR { get; set; }
    }
}
