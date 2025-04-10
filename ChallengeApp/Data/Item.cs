using System.ComponentModel.DataAnnotations;

namespace TestApp.Data
{
    public class Item
    {
        [Required]
        [StringLength(32)]
        public string ItemNumber { get; set; }

        [Required]
        [StringLength(256)]
        public string ItemName { get; set; }

        [Required]
        public int ItemTypeId { get; set; }

        [Required]
        [Range(1, 1000)]
        public int RoomNumber { get; set; }
    }
}