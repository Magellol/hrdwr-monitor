use std::ptr;
// winapi = { version = "0.3.9", features = ["pdh", "winerror"] }
use winapi::{ctypes::c_char, shared::winerror::ERROR_SUCCESS, um::pdh::*};

fn main() {
    unsafe {
        let mut cpu_query: PDH_HQUERY = ptr::null_mut();
        let mut cpu_total: PDH_HCOUNTER = ptr::null_mut();

        let err = PdhOpenQueryA(ptr::null(), 0, &mut cpu_query);
        assert_eq!(err, ERROR_SUCCESS as i32);

        let err = PdhAddCounterA(
            cpu_query,
            b"\\Processor(_Total)\\% Processor Time\0".as_ptr() as *const c_char,
            0,
            &mut cpu_total,
        );
        assert_eq!(err, ERROR_SUCCESS as i32);

        let mut counter_val: PDH_FMT_COUNTERVALUE = std::mem::zeroed();
        let err = PdhCollectQueryData(cpu_query);
        assert_eq!(err, ERROR_SUCCESS as i32);

        std::thread::sleep(std::time::Duration::from_millis(1000));

        let err = PdhCollectQueryData(cpu_query);
        assert_eq!(err, ERROR_SUCCESS as i32);

        let err = PdhGetFormattedCounterValue(
            cpu_total,
            PDH_FMT_DOUBLE,
            ptr::null_mut(),
            &mut counter_val,
        );
        assert_eq!(err, ERROR_SUCCESS as i32);

        println!("{:?}", counter_val.u.doubleValue());
    }
}