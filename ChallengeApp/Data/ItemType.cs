using System.ComponentModel.DataAnnotations;

namespace TestApp.Data
{
    public class ItemType
    {
        [Required]
        public int ItemTypeId { get; set; }

        [Required]
        [StringLength(128)]
        public string ItemTypeName { get; set; }
    }
}