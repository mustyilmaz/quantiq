import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import axios from 'axios';

interface TrendyolCategory {
  id: number;
  name: string;
  parentId: number | null;
  subCategories: TrendyolCategory[];
}

interface FlattenedCategory extends TrendyolCategory {
  level: number;
  hasSubCategories?: string;
}

const TrendyolCategories = () => {
  const [categories, setCategories] = useState<TrendyolCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Quantiq - Trendyol Kategorileri";
  }, []);

  const fetchTrendyolCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<TrendyolCategory[]>('/api/Trendyol/get-categories', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
        setError('Geçersiz veri formatı');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Kategoriler alınamadı');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendyolCategories();
  }, []);
  
  const flattenCategories = (categories: TrendyolCategory[], level = 0): FlattenedCategory[] => {
    return categories.reduce<FlattenedCategory[]>((acc, category) => {
      const flatCategory: FlattenedCategory = {
        ...category,
        name: "  ".repeat(level) + "└ " + category.name,
        level,
        hasSubCategories: category.subCategories?.length > 0 ? 'Var' : 'Yok'
      };
      
      return [
        ...acc,
        flatCategory,
        ...(category.subCategories?.length > 0 
          ? flattenCategories(category.subCategories, level + 1) 
          : [])
      ];
    }, []);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'Kategori ID', 
      width: 200,
      type: 'number'
    },
    { 
      field: 'name', 
      headerName: 'Kategori Adı', 
      width: 600,
      renderCell: (params: GridRenderCellParams<FlattenedCategory>) => (
        <div className="flex items-center" style={{ paddingLeft: `${params.row.level * 20}px` }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'parentId', 
      headerName: 'Üst Kategori ID', 
      width: 200,
      type: 'number'
    },
    {
      field: 'hasSubCategories', 
      headerName: 'Alt Kategoriler', 
      width: 200,
      type: 'string'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Trendyol Kategorileri
      </h1>
      
      {error && (
        <div className="mb-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={fetchTrendyolCategories}
            className="px-4 py-2 bg-accent-color text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      )}

      <Box className="bg-bg-secondary rounded-lg shadow-md">
        <DataGrid<FlattenedCategory>
          rows={flattenCategories(categories)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pageSize
              }
            },
          }}
          pageSizeOptions={[5, 10, 15, 25]}
          onPaginationModelChange={({ pageSize: newPageSize }) => setPageSize(newPageSize)}
          pagination
          loading={loading}
          localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-virtualScroller': {
              minHeight: '400px'
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
            }
          }}
        />
      </Box>
    </div>
  );
};

export default TrendyolCategories;
