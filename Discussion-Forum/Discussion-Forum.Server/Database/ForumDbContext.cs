using Discussion_Forum.Server.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Discussion_Forum.Server.Database
{
    public class ForumDbContext : IdentityDbContext<User>
    {
        public ForumDbContext() : base()
        {
        }
        public ForumDbContext(DbContextOptions<ForumDbContext> options) : base(options)
        {
        }

        public DbSet<Topic> Topics { get; set;}
        public DbSet<Post> Posts { get; set;}
        public DbSet<Comment> Comments { get; set;}
    }
}
