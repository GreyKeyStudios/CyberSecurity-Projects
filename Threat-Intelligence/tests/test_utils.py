import unittest
from unittest.mock import patch, Mock
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from scripts.utils import get_virustotal_data

class TestUtils(unittest.TestCase):
    @patch('scripts.utils.requests.get')
    def test_get_virustotal_data_hash(self, mock_get):
        # Mock response for a hash query
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "attributes": {
                    "last_analysis_stats": {"malicious": 2, "suspicious": 0, "harmless": 10},
                    "popular_threat_category": ["malware"],
                    "tags": ["game", "crack"]
                }
            }
        }
        mock_get.return_value = mock_response
        api_key = "dummy_key"
        query = "dummyhash"
        result = get_virustotal_data(api_key, query, "hash")
        self.assertIsNotNone(result)
        self.assertEqual(result["threat_label"], "Malicious")
        self.assertTrue(result["game_related"])
        self.assertIn("game", result["game_tags"])

if __name__ == "__main__":
    unittest.main() 