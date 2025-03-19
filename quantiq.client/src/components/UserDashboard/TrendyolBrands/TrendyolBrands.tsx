import { useState, useEffect } from 'react';
import axios from 'axios';
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

// Excel sütun harflerini oluşturan yardımcı fonksiyon
const getColumnLabel = (index: number): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let label = '';
  
  if (index >= letters.length) {
    label += letters[Math.floor(index / letters.length) - 1];
    label += letters[index % letters.length];
  } else {
    label = letters[index];
  }
  
  return label;
};

const GRID_COLUMNS = 4; // Grid sütun sayısı
const PAGE_SIZE = 1000; // Trendyol API'si bir sayfada minimum 1000 marka dönüyor

const TrendyolBrands = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // Daha fazla sayfa olup olmadığını kontrol etmek için

  useEffect(() => {
    document.title = "Quantiq - Trendyol Markaları";
  }, []);

  // URL parametrelerini güncelle
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    if (page !== 1) {
      params.set('page', page.toString());
    }
    
    setSearchParams(params);
  }, [searchTerm, page, setSearchParams]);

  // Markaları getir
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        setSearchMessage(null);
        
        if (searchTerm.trim()) {
          // Arama yapılıyorsa
          const response = await axios.get<Brand[]>(
            `/api/Trendyol/brands-by-name?name=${encodeURIComponent(searchTerm)}`,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('API Yanıtı:', response.data);

          if (Array.isArray(response.data)) {
            setFilteredBrands(response.data);
            if (response.data.length === 0) {
              setSearchMessage(`"${searchTerm}" için sonuç bulunamadı`);
            }
          } else {
            setFilteredBrands([]);
            setError('Beklenmeyen API yanıt formatı');
          }
          setHasMore(false);
        } else {
          // Normal sayfalı listeleme
          const response = await axios.get<BrandResponse>(`/api/Trendyol/brands?page=${page}&size=${PAGE_SIZE}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data && Array.isArray(response.data.brands)) {
            setFilteredBrands(response.data.brands);
            setHasMore(response.data.brands.length === PAGE_SIZE);
          } else {
            setFilteredBrands([]);
            setError('Geçersiz veri formatı');
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('Marka arama hatası:', error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Markalar yüklenirken bir hata oluştu');
        } else {
          setError('Markalar yüklenirken bir hata oluştu');
        }
        setFilteredBrands([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [page, searchTerm]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    
    // Boş arama kontrolü
    if (!searchValue.trim()) {
      setError(null); // Hata mesajını temizle
      setSearchTerm(''); // Arama terimini temizle
      setPage(1); // Sayfa numarasını sıfırla
      return;
    }
    
    // Arama terimini olduğu gibi kullan (büyük/küçük harf değiştirme)
    setSearchTerm(searchValue);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
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
            type="search"
            name="search"
            placeholder="Marka ara... (Aramak için Enter'a basın)"
            defaultValue={searchTerm}
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

      <div className="relative overflow-x-auto">
        {/* Sütun başlıkları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-2 min-w-[800px]">
          {Array.from({ length: GRID_COLUMNS }).map((_, index) => (
            <div key={`header-${index}`} className="text-center font-medium text-text-secondary">
              {getColumnLabel(index)}
            </div>
          ))}
        </div>

        {/* Markalar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-[800px]">
          {filteredBrands.map((brand, index) => {
            const row = Math.floor(index / GRID_COLUMNS) + 1;
            const col = getColumnLabel(index % GRID_COLUMNS);
            const position = `${col}-${row}`;
            const brandNumber = (page - 1) * PAGE_SIZE + index + 1;

            return (
              <div
                key={brand.id}
                className="p-4 bg-bg-secondary rounded-lg border border-border-color hover:border-accent-color transition-colors relative group"
                title={`Konum: ${position} / Marka No: ${brandNumber}`}
              >
                <div className="absolute -top-2 -left-2 bg-accent-color text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {position} / {brandNumber}
                </div>
                <p className="text-text-primary font-medium truncate">{brand.name}</p>
                <p className="text-text-secondary text-sm mt-1">ID: {brand.id}</p>
              </div>
            );
          })}
        </div>

        {/* Satır numaraları */}
        <div className="absolute left-0 top-0 -ml-8 hidden xl:block">
          {Array.from({ length: Math.ceil(filteredBrands.length / GRID_COLUMNS) }).map((_, index) => (
            <div
              key={`row-${index + 1}`}
              className="h-[88px] flex items-center justify-end text-text-secondary pr-2"
              style={{ marginTop: index === 0 ? '40px' : '0' }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Yatay scroll çubuğu varsa alt boşluk ekle */}
      <div className="h-4"></div>

      {!searchTerm && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg border border-border-color hover:border-accent-color disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki Sayfa
          </button>
          <span className="px-4 py-2">Sayfa {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={loading || !hasMore}
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
