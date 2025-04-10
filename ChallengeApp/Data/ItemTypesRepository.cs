using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestApp.Data
{
    public class ItemTypesRepository : IItemTypesRepository
    {
        private readonly string _connectionString;

        public ItemTypesRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ItemType>> GetAll()
        {
            var items = new List<ItemType>();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "SELECT ItemTypeId, ItemTypeName "+
                    "FROM ItemTypes", 
                    connection))
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        items.Add(new ItemType
                        {
                            ItemTypeId = reader.GetInt32(0),
                            ItemTypeName = reader.GetString(1),
                        });
                    }
                }
            }
            return items;
        }

        public async Task<ItemType> GetById(int itemTypeId)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "SELECT ItemTypeId, ItemTypeName "+
                    "FROM ItemTypes "+
                    "WHERE ItemTypeId = @id", 
                    connection))
                {
                    cmd.Parameters.AddWithValue("id", itemTypeId);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new ItemType
                            {
                                ItemTypeId = reader.GetInt32(0),
                                ItemTypeName = reader.GetString(1),
                            };
                        }
                        return null;
                    }
                }
            }
        }

        public async Task Add(ItemType item)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "INSERT INTO Items (ItemTypeName) " +
                    "VALUES (@itemTypeName)", connection))
                {
                    // cmd.Parameters.AddWithValue("itemTypeId", item.ItemTypeId);
                    cmd.Parameters.AddWithValue("itemTypeName", item.ItemTypeName);

                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
    }
}