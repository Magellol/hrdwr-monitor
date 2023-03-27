use winapi::um::pdh::{PdhOpenQuery, PdhAddCounter, PdhCollectQueryData, PDH_FMT_DOUBLE, PDH_INVALID_HANDLE, PdhGetFormattedCounterValue};
use winapi::um::pdh::PdhOpenQueryA;
use winapi::um::pdh::PdhAddCounterA;
use winapi::um::pdh::PdhCollectQueryDataEx;
use winapi::um::pdh::PDH_FMT_DOUBLE;
use winapi::um::pdh::PDH_INVALID_HANDLE;
use winapi::um::pdh::PdhGetFormattedCounterValue;
use winapi::shared::winerror::ERROR_SUCCESS;
use winapi::um::pdh::PDH_HCOUNTER;
use std::ptr::null_mut;

fn main() {
    unsafe {
        let mut query_handle: PDH_HQUERY = PDH_INVALID_HANDLE;
        let mut counter_handle: PDH_HCOUNTER = null_mut();

        // Open a new performance counter query
        if PdhOpenQueryA(null_mut(), 0, &mut query_handle) != ERROR_SUCCESS {
            panic!("Failed to open performance counter query");
        }

        // Add a counter to the query to monitor CPU temperature
        let counter_path = "\\Thermal Zone Information\\_TZ.THRM".as_bytes().to_vec();
        let counter_path_ptr = counter_path.as_ptr() as *mut i8;
        if PdhAddCounterA(query_handle, counter_path_ptr, 0, &mut counter_handle) != ERROR_SUCCESS {
            panic!("Failed to add performance counter to query");
        }

        // Collect the current value of the counter
        if PdhCollectQueryData(query_handle) != ERROR_SUCCESS {
            panic!("Failed to collect performance counter data");
        }

        // Get the formatted value of the counter
        let mut buffer_size: u32 = 0;
        if PdhGetFormattedCounterValue(counter_handle, PDH_FMT_DOUBLE, &mut buffer_size, null_mut(), &mut value) != ERROR_SUCCESS {
            panic!("Failed to get formatted performance counter value");
        }

        let mut value: f64 = 0.0;
        if PdhGetFormattedCounterValue(counter_handle, PDH_FMT_DOUBLE, &mut buffer_size, &mut value as *mut f64 as *mut _, null_mut()) != ERROR_SUCCESS {
            panic!("Failed to get formatted performance counter value");
        }

        println!("CPU temperature: {} degrees Celsius", value);
    }
}
