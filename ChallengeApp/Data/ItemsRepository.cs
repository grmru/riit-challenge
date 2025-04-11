using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestApp.Data
{
    public class ItemsRepository : IItemsRepository
    {
        private readonly string _connectionString;

        public ItemsRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Item>> GetAll()
        {
            var items = new List<Item>();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "SELECT ItemNumber, ItemName, ItemTypeId, RoomNumber "+
                    "FROM Items", 
                    connection))
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        items.Add(new Item
                        {
                            ItemNumber = reader.GetString(0),
                            ItemName = reader.GetString(1),
                            ItemTypeId = reader.GetInt32(2),
                            RoomNumber = reader.GetInt32(3)
                        });
                    }
                }
            }
            return items;
        }

        public async Task<Item> GetById(string itemNumber)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "SELECT ItemNumber, ItemName, ItemTypeId, RoomNumber "+
                    "FROM Items "+
                    "WHERE ItemNumber = @id", 
                    connection))
                {
                    cmd.Parameters.AddWithValue("id", itemNumber);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Item
                            {
                                ItemNumber = reader.GetString(0),
                                ItemName = reader.GetString(1),
                                ItemTypeId = reader.GetInt32(2),
                                RoomNumber = reader.GetInt32(3)
                            };
                        }
                        return null;
                    }
                }
            }
        }

        public async Task<bool> ValidateItemNumber(string itemNumber)
        {
            bool ret = false;
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "SELECT count(*) "+
                    "FROM Items "+
                    "WHERE ItemNumber = @id", 
                    connection))
                {
                    cmd.Parameters.AddWithValue("id", itemNumber);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            int count = reader.GetInt32(0);
                            if (count > 0) { ret = false; }
                            else { ret = true; }
                        }
                    }
                }
            }
            return ret;
        }

        public async Task Add(Item item)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "INSERT INTO Items (ItemNumber, ItemName, ItemTypeId, RoomNumber) " +
                    "VALUES (@itemNumber, @itemName, @itemTypeId, @roomNumber)", connection))
                {
                    cmd.Parameters.AddWithValue("itemNumber", item.ItemNumber);
                    cmd.Parameters.AddWithValue("itemName", item.ItemName);
                    cmd.Parameters.AddWithValue("itemTypeId", item.ItemTypeId);
                    cmd.Parameters.AddWithValue("roomNumber", item.RoomNumber);

                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task Update(Item item)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "UPDATE Items SET "+
                    "ItemName = @itemName, "+
                    "ItemTypeId = @itemTypeId, "+
                    "RoomNumber = @roomNumber " +
                    "WHERE ItemNumber = @itemNumber", 
                    connection))
                {
                    cmd.Parameters.AddWithValue("itemName", item.ItemName);
                    cmd.Parameters.AddWithValue("itemTypeId", item.ItemTypeId);
                    cmd.Parameters.AddWithValue("roomNumber", item.RoomNumber);
                    cmd.Parameters.AddWithValue("itemNumber", item.ItemNumber);


                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task Delete(string itemNumber)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var cmd = new NpgsqlCommand(
                    "DELETE FROM Items WHERE ItemNumber = @itemNumber", connection))
                {
                    cmd.Parameters.AddWithValue("itemNumber", itemNumber);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
    }
}