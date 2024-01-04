using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LoginAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace LoginAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly DataContext _context;

        private readonly IConfiguration _configuration;

        public LoginController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        private string GenerateJwtToken(user user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("SecretKey"));
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("email", user.email)
                }),
                Expires = DateTime.UtcNow.AddMilliseconds(1000),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("authenticate")]
        public IActionResult Authenticate(user credentials)
        {
            try
            {
                var existingUser = _context.users.FirstOrDefault(u => u.email == credentials.email);

                if (existingUser != null)
                {
                    // User already exists, check if the password is correct
                    if (existingUser.password == credentials.password)
                    {
                        // User is authenticated, generate JWT token
                        var token = GenerateJwtToken(existingUser);
                        return Ok(new { Token = token });
                    }
                    else
                    {
                        // Incorrect password
                        return Unauthorized("Incorrect password");
                    }
                }
                else
                {
                    // User doesn't exist
                    return Unauthorized("User not found");
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions here
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("{email}")]
        [Authorize]
        public IActionResult GetUserByUsername(string email)
        {
            try
            {
                var user = _context.users.FirstOrDefault(u => u.email == email);

                if (user != null)
                {
                    return Ok(user);
                }
                else
                {
                    return NotFound("User not found");
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions here
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("signup")]
        public IActionResult SignUp(user user)
        {
            try
            {
                // Check if the user already exists
                if (user.dob == "" || user.fname == "" || user.gender == "" || user.lname == "" || user.email == "" || user.password ==""){
                    return BadRequest("Enter all the details for successful registration");
                }
                else{
                    // Check if the user already exists
                    var existingUser = _context.users.Find(user.email);

                    if (existingUser != null)
                    {
                        return Conflict("User already exists");
                    }
                    else
                    {
                        _context.users.Add(user);
                        _context.SaveChanges();
                        return Created($"api/user/{user.email}", user);
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions here
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

    }
}