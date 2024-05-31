namespace Discussion_Forum.Server.Models.Entities
{
    public class Topic
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<Post> Posts { get; set; }
    }
}
