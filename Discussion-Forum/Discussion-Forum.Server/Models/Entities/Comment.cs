namespace Discussion_Forum.Server.Models.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; }

        public Guid PostId { get; set; }
        public Post Post { get; set; }
        public string AuthorId { get; set; }
        public User Author { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string UpdatedById { get; set; }
        public User UpdatedBy { get; set; }
    }
}
