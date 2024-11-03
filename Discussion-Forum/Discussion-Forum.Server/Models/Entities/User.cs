using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Discussion_Forum.Server.Models.Entities
{
    public class User : IdentityUser
    {
        [JsonIgnore]
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        [JsonIgnore]
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime lastLogin { get; set; }
    }
}
