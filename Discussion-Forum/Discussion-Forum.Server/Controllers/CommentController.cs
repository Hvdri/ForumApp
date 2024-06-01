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
    public class CommentController : ControllerBase
    {
        private readonly ForumDbContext _context;

        public CommentController(ForumDbContext context)
        {
            _context = context;
        }


        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<Comment>> GetComment(Guid id)
        {
            var comment =  await _context.Comments.FindAsync(id);
            
            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        [HttpPut("{id}"), Authorize(Roles = "User,Admin,Moderator")]
        public async Task<IActionResult> UpdateComment(Guid id, Comment updatedComment)
        {
            if (id != updatedComment.Id)
            {
                return BadRequest();
            }

            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var existingComment = await _context.Comments.FindAsync(id);
            if (existingComment == null)
            {
                return NotFound();
            }

            var isSuperUser = CheckSuperUser();
            var isAuthor = existingComment.AuthorId == loggedInUserId;

            if (!isSuperUser && !isAuthor)
            {
                return Forbid();
            }

            _context.Entry(updatedComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
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

        [HttpDelete("{id}"), Authorize(Roles = "User,Moderator,Admin")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine(loggedInUserId);

            var isSuperUser = CheckSuperUser();
            var isAuthor = comment.AuthorId == loggedInUserId;

            if (!isSuperUser && !isAuthor)
            {
                return Forbid();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(Guid id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }

        private bool CheckSuperUser()
        {
            return User.IsInRole("Admin") || User.IsInRole("Moderator");
        }
    }
}
