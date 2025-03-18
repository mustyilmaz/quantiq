import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface Brand {
  id: number;
  name: string;
}

interface BrandResponse {
  brands?: Brand[];
  message?: string;
}

const TrendyolBrands = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [inputSearch, setInputSearch] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searching, setSearching] = useState(!!searchParams.get('search'));
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  // URL parametrelerini güncelle
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    if (page !== 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    
    setSearchParams(params);
  }, [searchTerm, page, setSearchParams]);

  useEffect(() => {
    document.title = "Quantiq - Trendyol Markaları";
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        setSearchMessage(null);
        
        const response = await axios.get<Brand[]>(`/api/Trendyol/brands?page=${page}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (Array.isArray(response.data)) {
          setBrands(response.data);
          setFilteredBrands(response.data);
        } else {
          setBrands([]);
          setFilteredBrands([]);
          setError('Geçersiz veri formatı');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError('Markalar yüklenirken bir hata oluştu.');
        setBrands([]);
        setFilteredBrands([]);
      } finally {
        setLoading(false);
      }
    };

    if (!searching) {
      fetchBrands();
    }
  }, [page, searching]);

  /*
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearching(false);
      setSearchMessage(null);
      setFilteredBrands(brands);
      return;
    }

    if (searchTerm.trim().length >= 2) {
      const searchBrands = async () => {
        try {
          setSearching(true);
          setLoading(true);
          setSearchMessage(null);
          setError(null);
          
          const response = await axios.get<BrandResponse>(`/api/Trendyol/brands-by-name?q=${encodeURIComponent(searchTerm)}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data && typeof response.data === 'object' && 'message' in response.data) {
            setSearchMessage(response.data.message as string);
            
            if ('brands' in response.data && Array.isArray(response.data.brands)) {
              setFilteredBrands(response.data.brands as Brand[]);
            } else {
              setFilteredBrands([]);
            }
          } 
          else if (Array.isArray(response.data)) {
            setFilteredBrands(response.data);
          } 
          else {
            setFilteredBrands([]);
            setError('Geçersiz veri formatı');
          }
          
        } catch (error) {
          console.error('Error searching brands:', error);
          const axiosError = error as AxiosError;
          
          if (axiosError.response?.status === 404) {
            setSearchMessage(`"${searchTerm}" araması için hiçbir marka bulunamadı.`);
            setFilteredBrands([]);
          } else {
            setError('Marka araması yapılırken bir hata oluştu.');
          }
        } finally {
          setLoading(false);
        }
      };

      searchBrands();
    } else {
      const filtered = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchTerm, brands, page]);
  */

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputSearch.trim());
    setPage(1); // Arama yapıldığında sayfa 1'e dön
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Sayfa değiştiğinde en üste kaydır
  };

  if (loading && !filteredBrands.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-color"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Trendyol Markalar</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Marka ara... (Aramak için Enter'a basın)"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-bg-secondary border border-border-color focus:outline-none focus:border-accent-color"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-accent-color text-white rounded hover:bg-opacity-90"
          >
            Ara
          </button>
          <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
        </form>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 mb-4">
          {error}
        </div>
      )}

      {searchMessage && (
        <div className="text-amber-500 text-center p-4 mb-4">
          {searchMessage}
        </div>
      )}

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-color"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="p-4 bg-bg-secondary rounded-lg border border-border-color hover:border-accent-color transition-colors"
          >
            <p className="text-text-primary font-medium">{brand.name}</p>
            <p className="text-text-secondary text-sm mt-1">ID: {brand.id}</p>
          </div>
        ))}
      </div>

      {!searching && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg border border-border-color hover:border-accent-color disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki Sayfa
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={loading}
            className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg border border-border-color hover:border-accent-color disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki Sayfa
          </button>
        </div>
      )}

      {filteredBrands.length === 0 && !loading && !searchMessage && (
        <div className="text-center p-8 text-text-secondary">
          Marka bulunamadı
        </div>
      )}
    </div>
  );
};

export default TrendyolBrands;
