package rocks.zipcode.klasschat.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.klasschat.web.rest.TestUtil;

class ChannelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Channel.class);
        Channel channel1 = new Channel();
        channel1.setId(1L);
        Channel channel2 = new Channel();
        channel2.setId(channel1.getId());
        assertThat(channel1).isEqualTo(channel2);
        channel2.setId(2L);
        assertThat(channel1).isNotEqualTo(channel2);
        channel1.setId(null);
        assertThat(channel1).isNotEqualTo(channel2);
    }
}
