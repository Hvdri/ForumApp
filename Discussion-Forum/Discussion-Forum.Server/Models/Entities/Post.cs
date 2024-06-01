namespace Discussion_Forum.Server.Models.Entities
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public string AuthorId { get; set; }
        public virtual User Author { get; set; }
        public Guid TopicId { get; set; }
        public virtual Topic Topic { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
