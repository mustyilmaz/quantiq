import React, { useEffect, useState } from "react";
import styles from "./TrendyolCategories.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { Box, Tabs, Tab } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';

interface TrendyolCategory {
  id: number;
  name: string;
  parentId: number | null;
  subCategories: TrendyolCategory[];
}

const TrendyolCategories = () => {
  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - API Bilgileri";
  }, []);
  const auth = useAuth();
  const userId = auth?.user?.id;

  const [categories, setCategories] = useState<TrendyolCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(false);

  const fetchTrendyolCategories = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`/api/Trendyol/get-categories/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError(true);
        alert('Kategoriler alınamadı');
      }
    } catch (error) {
      console.error('Kategori çekme hatası:', error);
      setError(true);
      alert('Kategoriler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendyolCategories();
  }, [userId]);
  
  // Kategorileri düz listeye çevirme fonksiyonu güncellendi
  const flattenCategories = (categories: TrendyolCategory[], level = 0): any[] => {
    let result: any[] = [];
    categories.forEach(category => {
      result.push({
        id: category.id,
        name: "  ".repeat(level) + "└ " + category.name,
        parentId: category.parentId,
        subCategories: category.subCategories,
        level: level
      });
      if (category.subCategories?.length > 0) {
        result = result.concat(flattenCategories(category.subCategories, level + 1));
      }
    });
    return result;
  };

  // Sütun tanımları güncellendi
  const columns = [
    { field: 'id', headerName: 'Kategori ID', width: 200 },
    { 
      field: 'name', 
      headerName: 'Kategori Adı', 
      width: 600,
      renderCell: (params: any) => (
        <div style={{ 
          paddingLeft: `${params.row.level * 20}px`,
          display: 'flex',
          alignItems: 'center'
        }}>
          {params.value}
        </div>
      )
    },
    { field: 'parentId', headerName: 'Üst Kategori ID', width: 200 },
    {
      field: 'hasSubCategories', 
      headerName: 'Alt Kategoriler', 
      width: 200,
      renderCell: (params: { row: { subCategories?: any[] } }) => 
        (params.row.subCategories && params.row.subCategories.length > 0) ? 'Var' : 'Yok'
    },
  ];

  return (
    <div className={styles.container}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333'
      }}>
        Trendyol Kategorileri
      </h1>
      
      {error && (
        <Box sx={{ mb: 2 }}>
          <button 
            onClick={fetchTrendyolCategories}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Yeniden Dene
          </button>
        </Box>
      )}
      <Box sx={{ 
        height: 'auto', 
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        mt: 3,
        '& .MuiDataGrid-root': {
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: '#f5f5f5',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #e0e0e0',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #f0f0f0',
        }
      }}>
        <DataGrid
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
            '& .MuiDataGrid-virtualScroller': {
              minHeight: '400px',
            }
          }}
        />
      </Box>
    </div>
  );
};

export default TrendyolCategories;
