using Domain.Entities;
using Domain.Enums;
using Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Models;

namespace ProductCatalog.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class ProductController : ControllerBase
{
    private readonly ILogger<ProductController> _logger;
    private readonly ProductCatalogDbContext _context;
    private const int PageSize = 9;
    
    public ProductController(
        ILogger<ProductController> logger,
        ProductCatalogDbContext context
        )
    { 
        _logger = logger;
        _context = context;
        
    }
    
    [HttpGet]
    public async Task<IActionResult> Get(int pageIndex)
    {
        
        var totalCount = _context.Set<Product>().ToList().Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)PageSize);
        HttpContext.Response.Headers.Add("totalPages",totalPages.ToString());
        HttpContext.Response.Headers.Add("totalCount",totalCount.ToString());

        var paginatedList = await _context
            .Set<Product>()
            .OrderBy(p => p.CreatedAt)
            .Skip((pageIndex - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync();
        
        _logger.LogInformation("Produtos retornados com sucesso.");
        return Ok(paginatedList);
    }

    [HttpGet("byName")]
    public Task<IActionResult> GetByName()
    {
        //check if there is a querystring named 'productName'
        var productNameExists = Request.Query.TryGetValue("productName", out var productName);

        if (!productNameExists)
        {
            return Task.FromResult<IActionResult>(BadRequest("Digite um valor válido para realizar a filtragem."));
        }
        
        var filteredProductsByName = _context.Set<Product>()
            .AsNoTracking()
            .Where(p => p.Name.ToLower().Trim()
                .Contains(productName.ToString().ToLower().Trim()))
            .ToListAsync().Result;
                
        var totalCount = filteredProductsByName.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)PageSize);
        HttpContext.Response.Headers.Add("totalPages",totalPages.ToString());
        HttpContext.Response.Headers.Add("totalCount",totalCount.ToString());
        
        _logger.LogInformation("Produtos filtrados por nome.");
        return Task.FromResult<IActionResult>(Ok(filteredProductsByName));
    }
    
    
    [NonAction]
    private List<Product> GetProductsByOrderingValue(string orderingValue, int pageSize, int pageIndex )
    {
        var products = new List<Product>();
        
        var query = _context.Set<Product>();
        
        if (orderingValue == Enum.GetName(OrderBy.HighestValue))
        {
            products = query!
                .OrderByDescending(p => p.Price)
                .AsNoTracking()
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync().Result;
        }
        else if (orderingValue == Enum.GetName(OrderBy.LowerValue))
        {
            products = query!
                .OrderBy(p => p.Price)
                .AsNoTracking()
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync().Result;
        }

        return products;
    }

    [HttpGet("orderBy")]
    public async Task<IActionResult> GetProductsByPrice(int pageIndex)
    {
        
        var totalCount = _context.Set<Product>().ToList().Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)PageSize);
        HttpContext.Response.Headers.Add("totalPages",totalPages.ToString());
        HttpContext.Response.Headers.Add("totalCount",totalCount.ToString());
        
        var filterNameExists = Request.Query
                .TryGetValue("orderingValue", out var orderingValue);
        
        if (!filterNameExists)
        {
            return await Task.FromResult<IActionResult>(
                    BadRequest("Opção de ordenação não selecionada. Por favor, escolha uma opção.")
                    );
        }

        return Ok(GetProductsByOrderingValue(orderingValue.ToString(), PageSize, pageIndex));


    }

    [HttpGet("details")]
    public async Task<IActionResult> GetProductById()
    {
        
        var idExists = Request.Query
            .TryGetValue("id", out var productId);
        
        if (!idExists)
        {
            return await Task.FromResult<IActionResult>(
                BadRequest("Id de produto não informado. Por favor, informe um id.")
            );
        }
        

        if(await _context.Products!
            .AnyAsync(p => p.Id.ToString() == productId.ToString()))
        {
            var dbProduct = await _context.Products!
                .SingleOrDefaultAsync(p => p.Id.ToString() == productId.ToString());

            return Ok(dbProduct);
        }

        return NotFound("Desculpe, mas o produto não foi encontrado");
    }
    
    [NonAction]
    private Task<bool> CheckNameExistence(string name)
    {
        return Task.FromResult(_context.Set<Product>()!
            .AnyAsync(p => p.Name.ToLower().Trim() == name.ToLower().Trim()).Result);
    }
    
    [HttpPost]
    [Authorize(Policy = nameof(RolesEnum.Admin))]
    public async Task<IActionResult> PostAsync(ProductModel productModel)
    {
        if (CheckNameExistence(productModel.Name).Result)
        {
            _logger.LogError("O produto já existe.");
            return BadRequest($"O produto '{productModel.Name}' já existe, por favor digite um nome válido.");

        }
        
        var product = new Product()
        {
            Name = productModel.Name,
            QuantityInStock = productModel.QuantityInStock,
            Type = Enum.Parse<ProductTypeEnum>(productModel.Type),
            Price = productModel.Price,
            Description = productModel.Description,
            ImageRef = productModel.ImageRef,
            CreatedAt = DateTimeOffset.Now.ToUniversalTime()
        };
        
        await _context.Set<Product>().AddAsync(product);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Produto criado com sucesso.");
        return CreatedAtAction(nameof(Get), new { id = product.Id }, productModel);
    }

}