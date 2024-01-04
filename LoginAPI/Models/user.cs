using System.ComponentModel.DataAnnotations;

namespace LoginAPI.Models
{
    public class user
    {
 		[MaxLength(50)]
        public string ?fname { get; set; }

        [MaxLength(50)]
        public string ?lname { get; set; }

		[MaxLength(20)]
        public string ?dob { get; set; }

        [MaxLength(15)]
        public string ?gender { get; set; }

		[Key]
        [MaxLength(50)]
        [Required]
        public string ?email { get; set; }

        [Required]
        [MaxLength(50)]
        public string ?password { get; set; }
		    
    }
}
