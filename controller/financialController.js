const Finance = require('../model/financial')


// Controller function to get all finances
exports.getAllFinances = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

        // Calculate the offset and ensure limit is an integer
        const offset = (page - 1) * limit;
        const limitNumber = parseInt(limit);

        // Get the total count of finances for pagination metadata
        const totalFinances = await Finance.count();

        // Find finances with pagination
        const finances = await Finance.findAll({
            offset: offset,
            limit: limitNumber
        });

        if (!finances || finances.length === 0) {
            return res.status(404).json({ error: 'No finances found.' });
        }

        // Pagination metadata
        const pagination = {
            totalItems: totalFinances,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalFinances / limitNumber),
            itemsPerPage: limitNumber,
        };

        res.json({
            finances,
            pagination,
        });
    } catch (error) {
        console.error('getAllFinances: Error fetching finances:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
    }
};




// Controller function to get a single finance by ID
exports.getFinanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const finance = await Finance.findByPk(id);

        if (!finance) {
            return res.status(404).json({ error: 'Finance not found.' });
        }

        res.json(finance);
    } catch (error) {
        console.error('getFinanceById: Error fetching finance:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
    }
};


// Controller function to create a new finance
exports.createNewFinancial = async (req, res) => {
    try {
      const { transactionType, amount, description, transactionDate, createdBy } = req.body;
  
      const newFinance = await Finance.create({
        transactionType,
        amount,
        description,
        transactionDate,
        createdBy,
      });
  
      res.status(201).json(newFinance);
    } catch (error) {
      console.error('createNewFinancial: Error creating finance:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };
 exports.UpdateFinancial = async (req, res)=>{
 try{
     const {id}=req.params;
     const finance=await Finance.findByPk(id);
     if(!finance){
         return res.status(404).json({error:'Finance not found.'});
     }
     await finance.update(req.body);
     res.json(finance);
 }
 catch (e) {
    console.error('updateFinancial: Error updating finance:', e);
    res.status(500).json({ error: 'Internal Server Error', details: e.message || e });
}
 } 

 exports.deleteFinancial = async (req, res) => {
     try {
         const { id } = req.params;
         const finance = await Finance.findByPk(id);
         if (!finance) {
             return res.status(404).json({ error: 'Finance not found.' });
         }
         await finance.destroy();
         res.json({ message: 'Finance deleted successfully.' });
     } catch (error) {
         console.error('deleteFinancial: Error deleting finance:', error);
         res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
     }
 }

 // Controller function to get finances by branch ID
exports.getFinanceByBranchId = async (req, res) => {
    try {
        const { branchId } = req.params;

        const finances = await Finance.findAll({ where: { branchId } });

        if (!finances) {
            return res.status(404).json({ error: 'No finances found for this branch.' });
        }

        res.json(finances);
    }
    catch (error) {
        console.error('getFinanceById: Error fetching finances by branch ID:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
    }
}

// Controller function to get finances by date range
const { Op } = require('sequelize'); // Ensure Op is imported



exports.getFinanceByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate and parse dates
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required.' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format.' });
        }

        // Calculate pagination
        const offset = (page - 1) * limit;
        const limitNumber = parseInt(limit, 10);

        // Count total records in the date range
        const totalFinances = await Finance.count({
            where: {
                createdAt: {
                    [Op.between]: [start, end]
                }
            }
        });

        // Fetch paginated records
        const finances = await Finance.findAll({
            where: {
                createdAt: {
                    [Op.between]: [start, end]
                }
            },
            offset: offset,
            limit: limitNumber
        });

        if (finances.length === 0) {
            return res.status(404).json({ error: 'No finances found for this date range.' });
        }

        // Pagination metadata
        const pagination = {
            totalItems: totalFinances,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalFinances / limitNumber),
            itemsPerPage: limitNumber
        };

        res.json({
            finances,
            pagination
        });
    } catch (error) {
        console.error('getFinanceByDateRange: Error fetching finances by date range:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
    }
};






// Controller function to get finances by type
exports.getFinanceByType = async (req, res) => {
    try {
        const { transactionType } = req.params;

        const finances = await Finance.findAll({ where: { transactionType } });

        if (!finances) {
            return res.status(404).json({ error: 'No finances found of this type.' });
        }

        res.json(finances);
    } catch (error) {
        console.error('getFinanceByType: Error fetching finances by type:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
    }
}

// Controller function to get finances by amount range
// exports.getFinanceByAmountRange = async (req, res) => {
//     try {
//         const { minAmount, maxAmount } = req.params;

//         const finances = await Finance.findAll({
//             where: {
//                 amount: {
//                     [Op.between]: [minAmount, maxAmount]
//                 }
//             }
//         });

//         if (!finances) {
//             return res.status(404).json({ error: 'No finances found within this amount range.' });
//         }

//         res.json(finances);
//     } catch (error) {
//         console.error('getFinanceByAmountRange: Error fetching finances by amount range:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
// //     }
// }
// In FinanceController.js
exports.getFinanceByAmountRange = async (req, res) => {
    try {
      const { minAmount, maxAmount } = req.params;
      if (!minAmount || !maxAmount) {
        return res.status(400).json({ message: 'minAmount and maxAmount are required' });
      }
  
      const finances = await Finance.findAll({
        where: {
          amount: {
            [Op.between]: [parseFloat(minAmount), parseFloat(maxAmount)],
          },
        },
      });
  
      res.status(200).json(finances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
// Controller function to get finances by category