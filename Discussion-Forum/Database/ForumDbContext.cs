using Discussion_Forum.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Discussion_Forum.Database
{
    public class ForumDbContext : DbContext
    {
        public ForumDbContext()
        {
        }
        public ForumDbContext(DbContextOptions<ForumDbContext> options) : base(options)
        {
        }

        public DbSet<Topic> Topics { get; set; }
    }
}
