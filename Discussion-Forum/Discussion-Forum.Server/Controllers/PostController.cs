using Discussion_Forum.Server.Database;
using Discussion_Forum.Server.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Discussion_Forum.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly ForumDbContext _context;

        public PostController(ForumDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            var posts = await _context.Posts.ToListAsync();
            Console.Write(posts);
            return posts;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(Guid id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByPost(Guid id)
        {
            return await _context.Comments.Where(c => c.PostId == id).ToListAsync();
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Post>> CreatePost(CreatePostRequest postRequest)
        {
            var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var author = await _context.Users.FindAsync(authorId);
            if (author == null)
            {
                return NotFound("Author not found.");
            }

            var topic = await _context.Topics.FindAsync(postRequest.TopicId);
            if (topic == null)
            {
                return NotFound("Topic not found.");
            }

            var post = new Post
            {
                Id = Guid.NewGuid(),
                Title = postRequest.Title,
                Content = postRequest.Content,
                AuthorId = author.Id,
                Author = author,
                TopicId = postRequest.TopicId,
                Topic = topic,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        [HttpPost("{id}/comment"), Authorize]
        public async Task<ActionResult<Comment>> CreateComment(Guid id, CreateCommentRequest commentRequest)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return BadRequest("Post does not exist.");
            }

            var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var author = await _context.Users.FindAsync(authorId);
            if (author == null)
            {
                return NotFound("Author not found.");
            }

            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                Content = commentRequest.Content,
                PostId = id,
                Post = post,
                Author = author,
                AuthorId = authorId
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment); ;
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdatePost(Guid id, Post updatedPost)
        {
            if (id != updatedPost.Id)
            {
                return BadRequest();
            }

            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var existingPost = await _context.Posts.FindAsync(id);
            if (existingPost == null)
            {
                return NotFound();
            }

            var isSuperUser = CheckSuperUser();
            var isAuthor = existingPost.AuthorId == loggedInUserId;

            if (!isSuperUser && !isAuthor)
            {
                return Forbid();
            }

            _context.Entry(updatedPost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var isSuperUser = CheckSuperUser();
            var isAuthor = post.AuthorId == loggedInUserId;

            if (!isSuperUser && !isAuthor)
            {
                return Forbid();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(Guid id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }

        private bool CheckSuperUser()
        {
            return User.IsInRole("Admin") || User.IsInRole("Moderator");
        }

        public class CreatePostRequest
        {
            public string Title { get; set; }
            public string Content { get; set; }
            public Guid TopicId { get; set; }
        }
        public class CreateCommentRequest
        {
            public string Content { get; set; }
        }
    }
}
