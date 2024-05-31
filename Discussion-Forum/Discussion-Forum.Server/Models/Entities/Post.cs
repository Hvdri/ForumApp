namespace Discussion_Forum.Server.Models.Entities
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public string AuthorId { get; set; }
        public User Author { get; set; }
        public Guid TopicId { get; set; }
        public Topic Topic { get; set; }
        public ICollection<Comment> Comments { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
