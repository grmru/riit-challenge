using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestApp.Data
{
    public interface IItemTypesRepository
    {
        Task<IEnumerable<ItemType>> GetAll();
        Task<ItemType> GetById(int itemTypeId);
        Task Add(ItemType itemType);
    }
}